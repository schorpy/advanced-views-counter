import React, { useEffect, useState } from "react";
import "./Modal.scss";
const PopupModal = ({ popup, onClose }) => {
    if (!popup) return null;
    // useEffect(() => {
    //     const reinitWPForms = () => {
    //         if (window.WPForms?.FrontendModern) {
    //             window.WPForms.FrontendModern.init();
    //         }
    //         if (window.wpforms) {
    //             document.dispatchEvent(new Event("wpformsReady"));
    //         }

    //         // Pastikan AJAX aktif
    //         document.querySelectorAll(".wpforms-form").forEach((form) => {
    //             form.setAttribute("data-token", "true");
    //         });
    //     };

    //     // Tunggu elemen muncul sebelum inisialisasi
    //     const observer = new MutationObserver(() => {
    //         if (document.querySelector(".wpforms-form")) {
    //             reinitWPForms();
    //             observer.disconnect(); // Hentikan observer setelah form terdeteksi
    //         }
    //     });

    //     observer.observe(document.body, { childList: true, subtree: true });

    //     return () => observer.disconnect(); // Bersihkan observer saat modal ditutup
    // }, [popup]);
    return (
        <div className="popzy-modal">
            <div className="modal-container">
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="title">
                        {popup.settings.title && popup.settings.title !== "0" && <h3>{popup.title}</h3>}
                    </div>
                    <button type="button" className="close" onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    <div dangerouslySetInnerHTML={{ __html: popup.description }} />
                </div>


            </div>
        </div>
    );
};

export default PopupModal;
