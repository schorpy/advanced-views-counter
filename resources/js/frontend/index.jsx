import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import PopupModal from "./modal";
import FetchWrapper from './FetchWrapper.js';
import "./custom.js";

const Popup = () => {
    const [popups, setPopups] = useState([]);
    // const currentPath = window.location.pathname;
    const [selectedPopup, setSelectedPopup] = useState(null);
    const api = new FetchWrapper(popzy.rest_url, popzy.nonce);

    useEffect(() => {

        // api.get('/popups')
        //     .then(data => {
        //         console.log(data);
        //     })
        //     .catch((error) => console.error(error));

        if (popzy.is_home) {
            api.get(`/popup?type=homepage`)
                .then(data => {
                    // console.log(data);
                    setPopups(data);

                    if (data.settings.delay) {
                        let delay = parseInt(data.settings.delay.replace(/\D/g, '')); // Remove non-numeric characters
                        setTimeout(function () {
                            setSelectedPopup(data);
                        }, delay);
                    } else {
                        setSelectedPopup(data);
                    }

                })
                .catch((error) => console.error(error));
        } else {
            //Get Popup based post type and id
            api.get(`/popup?type=${encodeURIComponent(popzy.post_type)}&id=${encodeURIComponent(popzy.post_id)}`)
                .then(data => {
                    // console.log(data);
                    setPopups(data);

                    if (data.settings.delay) {
                        let delay = parseInt(data.settings.delay.replace(/\D/g, ''));
                        setTimeout(function () {
                            setSelectedPopup(data);
                        }, delay);
                    } else {
                        setSelectedPopup(data);
                    }



                })
                .catch((error) => console.error(error));
        }


    }, []);


    if (popups.length === 0) return null;
    return (
        <div>
            {selectedPopup && <PopupModal popup={selectedPopup} onClose={() => setSelectedPopup(null)} />}
            {/* {popups.map(popup => (

                <div key={popup.id} className="popup">
                    <h3>{popup.title}</h3>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: popup.description.replace(/<!--[\s\S]*?-->/g, "").trim(),
                        }}
                    />

                </div>
            ))} */}
        </div>
    );
};

createRoot(document.getElementById('popup-root')).render(<Popup />)
