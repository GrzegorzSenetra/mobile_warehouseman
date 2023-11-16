const basicDeleteService = async (link: string, data: any) => {
    try {
        const response = await fetch(`${link}${data}`, {
            method: 'DELETE'
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Nie udało się usunąć"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

export default basicDeleteService;