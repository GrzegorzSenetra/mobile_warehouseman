import * as React from 'react';
import Iframe from 'react-iframe';

export default function SuperComparer() {
    return (
        <div>
            <Iframe url="http://192.168.1.40:8080/super_comparer/"
                width="100%"
                height="600px"
                id="myId"
                className="myClassname"
                position="relative" />
        </div>
    );
}