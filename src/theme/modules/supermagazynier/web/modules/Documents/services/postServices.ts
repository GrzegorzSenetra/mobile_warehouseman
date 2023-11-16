import host from '../../../../../../../config/host'

const _postLabelPreview = async (type: string, body: any) => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/${type}`, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
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

const _exportToCSV = async (type: string, body: any) => {
    try {
        const response = await fetch(`${host.server_host}/listofproducts/${type}`, { // const response = await fetch(`${host.server_host}/listofproducts/${type}`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
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

const _get_tag_preview = async (data: any, filename: string) => {
    try {
        const response = await fetch(`${host.server_host}/tags/${filename}`, {
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

const _editLabel = async (type: string, body: any) => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/${type}`, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
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

const _importDocToApp = async (body: any) => {
    try {
        const response = await fetch(`${host.server_host}/import_doc_to_app`, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
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

export default { _exportToCSV, _get_tag_preview, _postLabelPreview, _editLabel, _importDocToApp }