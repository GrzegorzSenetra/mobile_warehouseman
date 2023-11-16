import * as React from 'react';
import getServices from  '../services/getServices';
import postServices from '../services/postServices';

const getToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy.toString() + mm.toString() + dd.toString();
}

export default function NewPzList() {
    
    const [newPzList, setNewPzList] = React.useState([]);
    const [from_date, setFromDate] = React.useState('');
    const [to_date, setToDate] = React.useState(getToday());

    React.useEffect(() => {
        getServices._getNewPzList(dateAdapt(from_date), dateAdapt(to_date))
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson);
            setNewPzList(responseJson);
        })
        .catch((error: any) => console.log(error));
    }, [to_date, from_date]);

    const dateAdapt = (date_val: string) => {
        return date_val.replace(/\D/g, '')
    }

    const importPzToApp = (document_id: string) => {
        console.log(localStorage.getItem('username'))
        postServices._importDocToApp({
            'document_id': document_id,
            'author': localStorage.getItem('username')
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => console.log(responseJson))
        .catch((error: any) => console.log(error))
    }


    return (
        <div className="new-pz-list">
            <h2 id="newPzList">Nowe pzki</h2>
            &nbsp;Start:
            <input
              type="date"
              id="start"
              name="fv-start"
              value={from_date}
              onChange={(e) => setFromDate(e.target.value)}
            />
            &nbsp;Koniec:
            <input
              type="date"
              id="stop"
              name="fv-stop"
              value={to_date}
              onChange={(e) => setToDate(e.target.value)}
            />

            { newPzList.length > 0 ? (
                <table style={{margin: 'auto'}} className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Nazwa Dokumentu</th>
                            <th>Kontrahent</th>
                            <th>Data</th>
                            <th>Importuj do magazyniera</th>
                        </tr>
                    </thead>
                    <tbody style={{width:'320', height:'80', overflow: 'auto'}}>
                        {newPzList.map((pz: any) => 
                            <tr key={pz[0]}>
                                <td>{pz[1]}</td>
                                <td>{pz[3]}</td>
                                <td>{pz[2]}</td>
                                <td><a onClick={() => importPzToApp(pz[1])}>importuj</a></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : null 
            }
        </div>
    );
}