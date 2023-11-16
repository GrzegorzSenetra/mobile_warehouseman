export const basicGetService = async (link: string, data: any) => {
    try {
        const response = await fetch(`${link}${data}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błędne dane"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

export const monthWorkdaysGetService = (link: string, month: number, year: number) => {
    try {
        const response = fetch(`${link}workdays/${month}/${year}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            })
        });
        return response
    }
    catch (error) {
        console.error(error);
    }
}

export const monthlyNormGetService = (link: string, month: number, year: number) => {
    try {
        const response = fetch(`${link}monthlynorm/${month}/${year}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            })
        });
        return response
    }
    catch (error) {
        console.error(error);
    }
}