export const generateRandomNumber = async (total: number): Promise<string> => {
    if (total <= 0) {
        throw new Error("Total digit harus lebih dari 0");
    }

    let randomNumber = "";
    
    for (let i = 0; i < total; i++) {
        const digit = Math.floor(Math.random() * 10); // Generate digit random dari 0 hingga 9
        randomNumber += digit.toString();
    }

    return randomNumber;
}