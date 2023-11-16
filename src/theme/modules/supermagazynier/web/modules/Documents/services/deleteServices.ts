import host from '../../../../../../../config/host'

const _deleteLabel = async (labelName: string) => {
    try {
        const response = await fetch(`${host.server_host}/label_creator/delete_label/${labelName}`, {
            method: 'DELETE',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
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

export default { _deleteLabel }