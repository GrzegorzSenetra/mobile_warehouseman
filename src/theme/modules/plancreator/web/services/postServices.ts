export const asyncPostService = async (link: string, data: any) => {
    try {
        const response = await fetch(`${link}`, {
            method: 'POST',
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

export const syncPostService = (link: string, data: any) => {
    try {
        const response = fetch(`${link}`, {
            method: 'POST',
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