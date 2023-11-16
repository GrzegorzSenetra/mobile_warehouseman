import host from '../../../../../../../config/host'

const _getProductsInDocument = async (data: any) => {
    try {
        const response = await fetch(`${host.server_host}/listofproducts/inventarisation_file/${data}`, {
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

const _exportToCSV = async (data: number) => {
    try {
        const response = await fetch(`${host.server_host}/document/export_to_csv/${data}`, {
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

const _getDocuments = async () => {
    try {
        const response = await fetch(`${host.server_host}/alldocuments/0${localStorage.getItem('username')}`, {
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

const _printAllTags = async (document_id: string, tag: string) => {
    try {
        const response = await fetch(`${host.server_host}/print_all_tags/${document_id}/${tag}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/msword'
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

const _get_tags_list = async (user_id:number) => {
    try {
        const response = await fetch(`${host.server_host}/favourite_tag/${user_id}`, {
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

const _getAllLabels = async () => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/get_all_labels/0`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/msword'
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

const _getLabelParams = async (labelName: string) => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/get_label_params/${labelName}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/msword'
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

const _getLabelParamsWeb = async (labelName: string) => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/get_label_params_web/${labelName}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/msword'
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

const _getNewPzList = async (from_date: string, to_date: string) => {
    try {
        const response = await fetch(`${host.server_host}/new_pz_find/${from_date}/${to_date}`, {
            method: 'GET',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/msword'
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


export default { 
    _getDocuments, 
    _exportToCSV, 
    _getProductsInDocument, 
    _printAllTags, 
    _get_tags_list,
    _getAllLabels,
    _getLabelParams,
    _getLabelParamsWeb,
    _getNewPzList
}