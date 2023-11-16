const asyncPutService = async (link: string, data: any) => {
    try {
        const response = await fetch(`${link}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błąd"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

const syncPutService = (link: string, data: any) => {
    try {
        const response = fetch(`${link}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return response
    }
    catch (error) {
        console.error(error);
    }
}

export { asyncPutService, syncPutService}