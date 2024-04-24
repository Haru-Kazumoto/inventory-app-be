import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserCreateDto } from './dto/user.dto';
import { IUserService } from './user.service.interface';
import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
import { UserRepository } from './repository/user.repository';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { RoleRepository } from 'src/modules/role/repository/role.repository';
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { NotificationService } from 'src/modules/notification/notification.service';
import { userCreateContent } from 'src/modules/notification/notification.constant';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto';
import * as bcrypt from "bcrypt";
import { UpdateUserPassword } from './dto/update-password-user.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService implements IUserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly notificationService: NotificationService,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
        private readonly dataSource: DataSource,
        private userUtils: UserUtils
    ){}

    @Transactional()
    public async createUser(body: UserCreateDto): Promise<User> {
        const user = await this.authService.getSession();
        
        await this
            .userUtils
            .checkField('username', body.username, 'Username telah terpakai')
            .isExists();

        const role = await this.roleRepository.findRoleById(body.role_id);
        const newUser = this.userRepository.create({
            ...body,
            role: role,
            password: await bcrypt.hash(body.password, 10)
        });

        /**
         * TODO : GANTI SISTEM NOTIFIKASI, BUAT KHUSUS UNTUK SUPERADMIN BIAR TERSTRUKTUR
         * 
         * TODO : UBAH VALIDASI DAN LOGIKA DI PERMINTAAN BARANG.
         */

        //SEND NOTIFICATION
        await this.notificationService.sendNotification({
            title: "Pengguna baru",
            content: userCreateContent,
            color: "clay",
            user_id: user.id,
            // superadmin_content: "Pengguna baru telah ditambahkan"
        });

        return await this.userRepository.save(newUser);
    }

    public async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
        return this.userRepository.findMany(pageOptionsDto);
    }

    @Transactional()
    public async update(id: number, body: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(id);

        if(!user) throw new DataNotFoundException("Id user not found", 400);

        if (body.username !== user.username) {
             await this.userUtils.checkField('username', body.username, "Username sudah ada").isExists();
        }

        const { password, ...rest } = body
        let newUserObject: User;

        if (password) {
            newUserObject = this.userRepository.merge(user, {...rest, password: await bcrypt.hash(password, 10)})
            // Object.assign(user, {...rest,password: await bcrypt.hash(password, 10)});
        } else {
            newUserObject = this.userRepository.merge(user, {...rest, password: user.password});
            // Object.assign(user, {...rest,password: user.password });
        }

        return await this.userRepository.save(newUserObject);
    }

    async updatePassword(id: number, newPassword: UpdateUserPassword): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();

        queryRunner.connect();
        queryRunner.startTransaction();

        try {
            const findUser = await this.userRepository.findOne({where: {id: id}});
            if(!findUser) throw new BadRequestException("User tidak di temukan");

            const newInstance = this.userRepository.merge(findUser, {
                password: await bcrypt.hash(newPassword.password, 10)
            });

            queryRunner.commitTransaction();

            return await this.userRepository.save(newInstance);
        } catch (err) {
            queryRunner.rollbackTransaction();

            throw err;
        } finally {
            queryRunner.release();
        }
    }

    public async hardDeleteById(id: number) {
        const data = await this.userRepository.findOne({where: {id: id}});
        if(!data) throw new DataNotFoundException("ID not found", 400);
        
        await this.userRepository.remove(data);
    }

    //BUG (hasMetadata) [TESTING]
    @Transactional()
    async softDeleteById(id: number): Promise<any> {
        const findId = await this.userRepository.findById(id);
        if(!findId) throw new DataNotFoundException("Id not found", 400);
        
        return await this.userRepository.softDelete(id);
    }

    //For Authentication
    public async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findUserByUsername(username);

        if(!user) throw new UnauthorizedException("Username or password is not valid", 401);

        return user;
    }

    public async findById(id: number): Promise<User> {
        const user =  await this.userRepository.findById(id);
        if(!user) throw new DataNotFoundException("Id user not found.", 400);

        return user;
    }

    public async findUserById(userId: number): Promise<User>{
        return await this.userRepository.findUserById(userId).then(
            () => { throw new DataNotFoundException("User not found", 400); }
        );
    } 
}
