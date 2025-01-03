import {RadioInput,Dropdown, DropdownRsHmRadioForm} from './DropdownAndRadio'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Blob from './Blob';
import { CiSquarePlus,CiSquareMinus} from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

export function LancerCandidatureForm({ toggleForm }) {
    const [formValues, setFormValues] = useState({
        TITRE: '',
        DATEDEPART: '',
        DATEFIN: '',
        PROFESSION: '',
        Demandes: []
    });

    const [formErrors, setFormErrors] = useState({
        TITRE: false,
        DATEDEPART: false,
        DATEFIN: false,
        PROFESSION: false
    });

    const [submissionStatus, setSubmissionStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
        setFormErrors({
            ...formErrors,
            [name]: false
        });
    };

    const handleProfessionChange = (profession) => {
        setFormValues({
            ...formValues,
            PROFESSION: profession
        });
        setFormErrors({
            ...formErrors,
            PROFESSION: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {
            TITRE: formValues.TITRE.trim() === '',
            DATEDEPART: formValues.DATEDEPART.trim() === '',
            DATEFIN: formValues.DATEFIN.trim() === '',
            PROFESSION: formValues.PROFESSION.trim() === '' || formValues.PROFESSION === 'Choisir votre profession'
        };

        setFormErrors(errors);

        const hasErrors = Object.values(errors).some(error => error);

        if (!hasErrors) {
            try {
                const response = await axios.post('http://localhost:5116/api/Candidature', formValues, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setSubmissionStatus('Candidature créée avec succès.');
            } catch (error) {
                if (error.response && error.response.data) {
                    setSubmissionStatus(error.response.data);
                } else {
                    setSubmissionStatus('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
                }
            }
        }
    };

    const clearStatus = () => {
        setSubmissionStatus('');
    };

    return (
        <div className='w-full box-shadowcust max-w-2xl bg-white/90 rounded-lg py-4 mb-4  RHumain'>
            <header className='mb-4 mt-3 text-white font-semibold text-xl items-center flex justify-between'>
                <div className='bg-[#0079ad] px-5 py-1 rounded-tr-lg rounded-br-lg'>
                    Creer une nouvelle candidature
                </div>
                <button
                    className='text-[#0079ad] text-4xl pr-10 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]'
                    onClick={toggleForm}
                >
                    <CiSquareMinus />
                </button>
            </header>
            <form onSubmit={handleSubmit} className='px-10'>
                <div className='flex h-full space-x-4'>
                    <div className='flex-1'>
                        <DropdownRsHmRadioForm 
                            selectedProfession={formValues.PROFESSION}
                            onProfessionChange={handleProfessionChange}
                            onFocus={clearStatus}
                        />
                        {formErrors.PROFESSION && <p className="text-red-500">Ce champ est requis</p>}
                    </div>
                    <div className='flex-1 flex flex-col space-y-3'>
                        <p>Titre</p>
                        <textarea
                            className={`Textarea flex-grow ${formErrors.TITRE ? 'border-red-500' : ''}`}
                            placeholder="Tapez le titre de la candidature..."
                            name="TITRE"
                            value={formValues.TITRE}
                            onChange={handleInputChange}
                            onFocus={clearStatus}
                        ></textarea>
                        {formErrors.TITRE && <p className="text-red-500">Ce champ est requis</p>}
                    </div>
                </div>
                <div className='flex mt-5 space-x-4'>
                    <div className='flex-1 space-y-3'>
                        <p>Date Depart</p>
                        <input
                            type="date"
                            className={`w-full bg-[#d1d5db] border-none rounded py-2.5 px-4 leading-tight ${formErrors.DATEDEPART ? 'border-red-500' : ''}`}
                            name="DATEDEPART"
                            value={formValues.DATEDEPART}
                            onChange={handleInputChange}
                            onFocus={clearStatus}
                        />
                        {formErrors.DATEDEPART && <p className="text-red-500">Ce champ est requis</p>}
                    </div>
                    <div className='flex-1 space-y-3'>
                        <p>Date Fin</p>
                        <input
                            type="date"
                            className={`w-full bg-[#d1d5db] border-none border-gray-200 rounded py-2.5 px-4 leading-tight ${formErrors.DATEFIN ? 'border-red-500' : ''}`}
                            name="DATEFIN"
                            value={formValues.DATEFIN}
                            onChange={handleInputChange}
                            onFocus={clearStatus}
                        />
                        {formErrors.DATEFIN && <p className="text-red-500">Ce champ est requis</p>}
                    </div>
                </div>
                <div className='flex items-center mt-10'>
                    <div className='flex-1 flex justify-center'>
                        <label htmlFor="" className={` ${submissionStatus.includes('succès') ? 'text-[#12648e]' : 'text-red-600'}`}>
                            {typeof submissionStatus === 'string' ? submissionStatus : 'Erreur inattendue'}
                        </label>
                    </div>
                    <div className='flex justify-end'>
                        <button type="submit" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-1">Creer</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export function CandidatureInfo({ candidature, updateCandidature, setCandidatures }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editValues, setEditValues] = useState({ ...candidature });
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/LogIn/Admin/Demand', { 
            state: { 
                id: candidature.iD_CANDIDATURE, 
                titre: candidature.titre, 
                profession: candidature.profession 
            } 
        });
    };

    const toggleContent = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const toggleEditMode = (e) => {
        e.stopPropagation();
        setIsEditMode(!isEditMode);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditValues({ ...editValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.stopPropagation();
        updateCandidature(editValues);
        toggleEditMode();
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to delete this candidature?");
        if (confirmed) {
            await deleteCandidature(candidature.iD_CANDIDATURE);
        }
    };

    const deleteCandidature = async (id) => {
        try {
            const response = await fetch(`http://localhost:5116/api/Candidature/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                setCandidatures((prevCandidatures) => prevCandidatures.filter(c => c.iD_CANDIDATURE !== id));
            } else {
                const responseText = await response.text(); // Log response as text to handle non-JSON responses
                console.error('Failed to delete candidature:', responseText);
            }
        } catch (error) {
            console.error('Failed to delete candidature:', error);
        }
    };

    return (
        <div className='w-full flex flex-col items-center mb-2'>
            <div
                onClick={handleClick}
                className='active:duration-750 transition-all ease-in-out hover:scale-[1.01] cursor-pointer bg-white/90 border border-gray-300 rounded-lg py-3 px-5 flex justify-between items-center w-full'
            >
                <div>
                    <p className='font-semibold text-[#12648e] pl-5'>
                        {editValues.profession}
                    </p>
                </div>
                <div className='text-2xl text-[#12648e] cursor-pointer' onClick={toggleContent}>
                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
            </div>
            <CSSTransition
                in={isOpen}
                timeout={300}
                classNames="content"
                unmountOnExit
            >
                <div className='w-full max-w-2xl bg-gray-200 py-5 px-8 rounded-br-lg rounded-bl-lg'>
                    <div className='flex justify-center space-x-5'>
                        <div className='space-y-5'>
                            <div className='space-y-2'>
                                <p>Date Depart</p>
                                <input
                                    type="date"
                                    name="datedepart"
                                    value={editValues.datedepart}
                                    readOnly={!isEditMode}
                                    onChange={handleChange}
                                    className="w-full bg-[#d1d5db] border-none rounded py-2.5 px-4 leading-tight"
                                />
                            </div>
                            <div className='space-y-2'>
                                <p>Date Fin</p>
                                <input
                                    type="date"
                                    name="datefin"
                                    value={editValues.datefin}
                                    readOnly={!isEditMode}
                                    onChange={handleChange}
                                    className="w-60 bg-[#d1d5db] border-none border-gray-200 rounded py-2.5 px-4 leading-tight"
                                />
                            </div>
                        </div>
                        <div className='flex-1 flex flex-col space-y-2'>
                            <p>Titre</p>
                            <textarea
                                name="titre"
                                className="Textarea flex-grow"
                                value={editValues.titre}
                                readOnly={!isEditMode}
                                onChange={handleChange}
                                placeholder="Tapez le titre de la candidature..."
                            ></textarea>
                        </div>
                    </div>
                    <div className='flex justify-end space-x-3 mt-5'>
                        {isEditMode ? (
                            <button
                                type="button"
                                className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-2"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-2"
                                onClick={toggleEditMode}
                            >
                                Modifier
                            </button>
                        )}
                        <button
                            type="button"
                            className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-red-600 text-white rounded-lg px-5 py-2"
                            onClick={handleDelete}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}


// function CandidatureInfo({ candidature, updateCandidature }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editValues, setEditValues] = useState({ ...candidature });
//     const navigate = useNavigate();

//     // const handleClick = () => {
//     //     navigate('/LogIn/Admin/Demand', { state: { id: candidature.iD_CANDIDATURE } });
//     // };
//     const handleClick = () => {
//         navigate('/LogIn/Admin/Demand', { 
//             state: { 
//                 id: candidature.iD_CANDIDATURE, 
//                 titre: candidature.titre, 
//                 profession: candidature.profession 
//             } 
//         });
//     };
    
//     const toggleContent = (e) => {
//         e.stopPropagation();
//         setIsOpen(!isOpen);
//     };

//     const toggleEditMode = (e) => {
//         e.stopPropagation();
//         setIsEditMode(!isEditMode);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEditValues({ ...editValues, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.stopPropagation();
//         updateCandidature(editValues);
//         toggleEditMode();
//     };

//     const formatDate = (date) => {
//         if (!date) return 'Invalid date';
//         try {
//             const localDate = new Date(date);
//             return localDate.toISOString().split('T')[0];
//         } catch (error) {
//             return 'Invalid date';
//         }
//     };

//     return (
//         <div className='w-full flex flex-col items-center mb-2'>
//             <div
//                 onClick={handleClick}
//                 className='active:duration-750 transition-all ease-in-out hover:scale-[1.01] cursor-pointer bg-white/90 border border-gray-300 rounded-lg py-3 px-5 flex justify-between items-center w-full'
//             >
//                 <div>
//                     <p className='font-semibold text-[#12648e] pl-5'>
//                         {editValues.profession}
//                     </p>
//                 </div>
//                 <div className='text-2xl text-[#12648e] cursor-pointer' onClick={toggleContent}>
//                     {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                 </div>
//             </div>
//             <CSSTransition
//                 in={isOpen}
//                 timeout={300}
//                 classNames="content"
//                 unmountOnExit
//             >
//                 <div className='w-full max-w-2xl bg-gray-200 py-5 px-8 rounded-br-lg rounded-bl-lg'>
//                     <div className='flex justify-center space-x-5'>
//                         <div className='space-y-5'>
//                             <div className='space-y-2'>
//                                 <p>Date Depart</p>
//                                 <input
//                                     type="date"
//                                     name="datedepart"
//                                     value={editValues.datedepart}
//                                     readOnly={!isEditMode}
//                                     onChange={handleChange}
//                                     className="w-full bg-[#d1d5db] border-none rounded py-2.5 px-4 leading-tight"
//                                 />
//                             </div>
//                             <div className='space-y-2'>
//                                 <p>Date Fin</p>
//                                 <input
//                                     type="date"
//                                     name="datefin"
//                                     value={editValues.datefin}
//                                     readOnly={!isEditMode}
//                                     onChange={handleChange}
//                                     className="w-60 bg-[#d1d5db] border-none border-gray-200 rounded py-2.5 px-4 leading-tight"
//                                 />
//                             </div>
//                         </div>
//                         <div className='flex-1 flex flex-col space-y-2'>
//                             <p>Titre</p>
//                             <textarea
//                                 name="titre"
//                                 className="Textarea flex-grow"
//                                 value={editValues.titre}
//                                 readOnly={!isEditMode}
//                                 onChange={handleChange}
//                                 placeholder="Tapez le titre de la candidature..."
//                             ></textarea>
//                         </div>
//                     </div>
//                     <div className='flex justify-end space-x-3 mt-5'>
//                         {isEditMode ? (
//                             <button
//                                 type="button"
//                                 className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-2"
//                                 onClick={handleSubmit}
//                             >
//                                 Save
//                             </button>
//                         ) : (
//                             <button
//                                 type="button"
//                                 className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-2"
//                                 onClick={toggleEditMode}
//                             >
//                                 Modifier
//                             </button>
//                         )}
//                         <button
//                             type="button"
//                             className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-red-600 text-white rounded-lg px-5 py-2"
//                             onClick={(e) => { e.stopPropagation(); /* add delete logic here */ }}
//                         >
//                             Supprimer
//                         </button>
//                     </div>
//                 </div>
//             </CSSTransition>
//         </div>
//     );
// }

// export function HumainRessouceInterface() {
//     const [showForm, setShowForm] = useState(false);
//     const [candidatures, setCandidatures] = useState([]);

//     useEffect(() => {
//         const fetchCandidatures = async () => {
//             try {
//                 const response = await fetch('http://localhost:5116/api/Candidature/all', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 const text = await response.text();
//                 const data = JSON.parse(text);
    
//                 if (data && data.$values) {
//                     const formattedData = data.$values.map(c => ({
//                         ...c,
//                         datedepart: formatDate(c.datedepart),
//                         datefin: formatDate(c.datefin),
//                     }));
//                     setCandidatures(formattedData);
//                 } else {
//                     console.error('Unexpected response format:', data);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch candidatures:', error);
//             }
//         };
    
//         fetchCandidatures();
//     }, []);
    
//     const formatDate = (date) => {
//         if (!date) return 'Invalid date';
//         try {
//             const localDate = new Date(date);
//             return localDate.toISOString().split('T')[0];
//         } catch (error) {
//             return 'Invalid date';
//         }
//     };
    
//     const toggleForm = () => {
//         setShowForm(!showForm);
//     };

//     const updateCandidature = async (updatedCandidature) => {
//         const { iD_CANDIDATURE, profession, datedepart, datefin, titre } = updatedCandidature;
//         const payload = {
//             ID_CANDIDATURE: iD_CANDIDATURE,
//             PROFESSION: profession,
//             DATEDEPART: datedepart,
//             DATEFIN: datefin,
//             TITRE: titre
//         };
    
//         console.log('Updating candidature:', payload);
    
//         try {
//             const response = await fetch(`http://localhost:5116/api/Candidature/${iD_CANDIDATURE}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });
    
//             const responseData = await response.json();
//             if (response.ok) {
//                 setCandidatures((prevCandidatures) =>
//                     prevCandidatures.map((candidature) =>
//                         candidature.iD_CANDIDATURE === iD_CANDIDATURE ? updatedCandidature : candidature
//                     )
//                 );
//             } else {
//                 console.error('Failed to update candidature:', responseData.errors);
//             }
//         } catch (error) {
//             console.error('Failed to update candidature:', error);
//         }
//     };
    

//     return (
//         <div className='flex flex-col items-center w-full min-h-screen px-2 '>
//             <header className='flex items-center w-full '>
//                 <div className='px-2 mt-4 bg-white/90 rounded-md'>
//                     <img src={ChuLogo} className='max-w-[260px]' />
//                 </div>
//             </header>
//             <Blob />
//             {showForm ? (
//                 <LancerCandidatureForm toggleForm={toggleForm} />
//             ) : (
//                 <div className='bg-white/95 box-shadowcust rounded-lg py-4 w-full  max-w-4xl mx-2 RHumain mt-4 mb-2'>
//                     <header className='mb-4 mt-3 text-white font-semibold text-xl flex justify-between items-center'>
//                         <div className='bg-[#12648e] px-5 py-1 rounded-tr-lg rounded-br-lg'>
//                             CHU Candidatures
//                         </div>
//                         <button 
//                             className='text-[#12648e] text-4xl pr-4 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]'
//                             onClick={toggleForm}
//                         >
//                             <CiSquarePlus />
//                         </button>
//                     </header>
//                     <div className='flex flex-col  mx-2 rounded-lg p-2 overflow-y-auto max-h-[85vh]'>
//                         {Array.isArray(candidatures) ? (
//                             candidatures.map(candidature => (
//                                 <CandidatureInfo key={candidature.iD_CANDIDATURE} candidature={candidature} updateCandidature={updateCandidature} />
//                             ))
//                         ) : (
//                             <p>No candidatures found.</p>
//                         )}
//                     </div> 
//                 </div>
//             )}
//         </div>
//     );}

export function HumainRessouceInterface() {
    const [showForm, setShowForm] = useState(false);
    const [candidatures, setCandidatures] = useState([]);

    useEffect(() => {
        const fetchCandidatures = async () => {
            try {
                const response = await fetch('http://localhost:5116/api/Candidature/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const text = await response.text();
                const data = JSON.parse(text);
    
                if (data && data.$values) {
                    const formattedData = data.$values.map(c => ({
                        ...c,
                        datedepart: formatDate(c.datedepart),
                        datefin: formatDate(c.datefin),
                    }));
                    setCandidatures(formattedData);
                } else {
                    console.error('Unexpected response format:', data);
                }
            } catch (error) {
                console.error('Failed to fetch candidatures:', error);
            }
        };
    
        fetchCandidatures();
    }, []);
    
    const formatDate = (date) => {
        if (!date) return 'Invalid date';
        try {
            const localDate = new Date(date);
            return localDate.toISOString().split('T')[0];
        } catch (error) {
            return 'Invalid date';
        }
    };
    
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const updateCandidature = async (updatedCandidature) => {
        const { iD_CANDIDATURE, profession, datedepart, datefin, titre } = updatedCandidature;
        const payload = {
            ID_CANDIDATURE: iD_CANDIDATURE,
            PROFESSION: profession,
            DATEDEPART: datedepart,
            DATEFIN: datefin,
            TITRE: titre
        };
    
        console.log('Updating candidature:', payload);
    
        try {
            const response = await fetch(`http://localhost:5116/api/Candidature/${iD_CANDIDATURE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            const responseData = await response.json();
            if (response.ok) {
                setCandidatures((prevCandidatures) =>
                    prevCandidatures.map((candidature) =>
                        candidature.iD_CANDIDATURE === iD_CANDIDATURE ? updatedCandidature : candidature
                    )
                );
            } else {
                console.error('Failed to update candidature:', responseData.errors);
            }
        } catch (error) {
            console.error('Failed to update candidature:', error);
        }
    };

    return (
        <div className='flex flex-col items-center w-full min-h-screen px-2 '>
            <header className='flex items-center w-full '>
                <div className='px-2 mt-4 bg-white/90 rounded-md'>
                    <img src={ChuLogo} className='max-w-[260px]' />
                </div>
            </header>
            <Blob />
            {showForm ? (
                <LancerCandidatureForm toggleForm={toggleForm} />
            ) : (
                <div className='bg-white/95 box-shadowcust rounded-lg py-4 w-full  max-w-4xl mx-2 RHumain mt-4 mb-2'>
                    <header className='mb-4 mt-3 text-white font-semibold text-xl flex justify-between items-center'>
                        <div className='bg-[#12648e] px-5 py-1 rounded-tr-lg rounded-br-lg'>
                            CHU Candidatures
                        </div>
                        <button 
                            className='text-[#12648e] text-4xl pr-4 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]'
                            onClick={toggleForm}
                        >
                            <CiSquarePlus />
                        </button>
                    </header>
                    <div className='flex flex-col  mx-2 rounded-lg p-2 overflow-y-auto max-h-[85vh]'>
                        {Array.isArray(candidatures) ? (
                            candidatures.map(candidature => (
                                <CandidatureInfo key={candidature.iD_CANDIDATURE} candidature={candidature} updateCandidature={updateCandidature} setCandidatures={setCandidatures} />
                            ))
                        ) : (
                            <p>No candidatures found.</p>
                        )}
                    </div> 
                </div>
            )}
        </div>
    );
}

import ChuLogo from '../img/ChuLogo.png';


export function DemandHumainRessouceInterface() {
    const location = useLocation();
    const { id } = location.state || {};
    const candidatureId = id;
    const { titre } = location.state || {};
    const {profession} = location.state || {};

    const [showDemandUserInfo, setShowDemandUserInfo] = useState(true);
    const [demands, setDemands] = useState([]);

    useEffect(() => {
        const fetchDemands = async () => {
            if (!candidatureId) {
                console.error('Candidature ID is not found in local storage');
                return;
            }
            try {
                const response = await fetch(`http://localhost:5116/api/demandes?iD_CANDIDATURE=${candidatureId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching demands: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Fetched data:', data);  // Log the fetched data
                if (data && Array.isArray(data.$values)) {
                    setDemands(data.$values.map(item => ({
                        ...item,
                        id: item.id // Ensure 'id' is set correctly for each item
                    })));
                } else {
                    console.error('Fetched data is not in the expected format:', data);
                }
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchDemands();
    }, [candidatureId]);

    const handleToggle = () => {
        setShowDemandUserInfo(!showDemandUserInfo);
    };

    return (
        <div className='flex flex-col items-center w-full min-h-screen mx-2'>
            <header className='flex w-full items-center bg-white/90'>
                <div className='px-2 mt-4 rounded-md'>
                    <img src={ChuLogo} alt="CHU Logo" className='max-w-[260px]' />
                </div>
                <div className=' flex-1 font-medium m-2 rounded-lg text-[#12648e] font-medium text-3xl p-4 flex justify-center leading-[40px] max-w-4xl'>
                    {titre}
                </div>
            </header>
            <Blob />
            {showDemandUserInfo ? (
                <div className='bg-white/95 box-shadowcust rounded-lg py-4 w-full max-w-2xl mx-2 RHumain mt-4 mb-4'>
                    <header className='mb-4 mt-3 text-white font-semibold text-xl flex justify-between items-center'>
                        <div className='bg-[#12648e] px-5 py-1 rounded-tr-lg rounded-br-lg'>
                            {profession}
                        </div>
                    </header>
                    <div className='flex flex-col gap-2 mx-2 rounded-lg overflow-y-auto' style={{ maxHeight: '81vh' }}>
                        {demands.map((demand) => (
                            <DemandeInfo key={demand.id} demand={demand} onToggle={handleToggle} />
                        ))}
                    </div>
                </div>
            ) : (
                <DemandUserInfo onToggle={handleToggle} />
            )}
        </div>
    );
}
export function DemandeInfo({ demand, onToggle }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/LogIn/Admin/Demand/UserInfo', { state: { demand } });
    };

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='bg-white/90 border border-gray-300 rounded-lg py-3 px-5 flex justify-between items-center w-full'>
                <div>
                    <p className='text-[#12648e]'>
                        {demand.nom} {demand.prenom}
                    </p>
                </div>
                <div className='text-2xl text-[#12648e] cursor-pointer' onClick={handleNavigate}>
                    <CiSquarePlus />
                </div>
            </div>
        </div>
    );
}

// export function DemandeInfo({ demand, onToggle }) {
//     return (
//         <div className='w-full flex flex-col items-center'>
//             <div className='bg-white/90 border border-gray-300 rounded-lg py-3 px-5 flex justify-between items-center w-full'>
//                 <div>
//                     <p className='text-[#12648e]'>
//                         {demand.nom} {demand.prenom}
//                     </p>
//                 </div>
//                 <div className='text-2xl text-[#12648e] cursor-pointer' onClick={onToggle}>
//                     <CiSquarePlus />
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useNavigate } from 'react-router-dom';

export function DemandUserInfo({ onToggle }) {
    const location = useLocation();
    const { demand } = location.state;
    const [file, setFile] = useState(null);

    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:5116/api/Demandes/UpdateValidation/${demand.id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ validation: 'Accepte' }),
});
    
            if (response.ok) {
                alert('Demand accepted successfully.');
            } else {
                const errorData = await response.json();
                console.error('Failed to accept the demand. Error:', errorData);
                alert(`Failed to accept the demand. Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error accepting demand:', error);
            alert('Failed to accept the demand.');
        }
    };
    
    console.log("fasdlkfhalskjdfa ;ksldfj a : ",demand.id)

    const handleRefuse = async () => {
        try {
            const response = await fetch(`http://localhost:5116/api/Demandes/UpdateValidation/${demand.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ validation: 'Refuse' }),
            });

            if (response.ok) {
                alert('Demand refused successfully.');
            } else {
                const errorData = await response.json();
                console.error('Failed to refuse the demand. Error:', errorData);
                alert(`Failed to refuse the demand. Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error refusing demand:', error);
            alert('Failed to refuse the demand.');
        }
    };

    return (
        <div className='flex flex-col items-center w-full min-h-screen mx-2'>
            <header className='flex justify-center bg-white/90 rounded-md'>
                <div className='px-2 mt-4 flex'>
                    <img src={ChuLogo} alt="CHU Logo" className='max-w-[23vw]' />
                </div>
            </header>
            <Blob />
            <div className='w-full max-w-[95%] bg-white/95 py-5 px-8 rounded-lg mt-8 border border-gray-300 my-8 RHumain'>
                <div className='w-full flex justify-between items-center mb-8'>
                    <div>
                        <p className='text-2xl font-medium'>{demand.nom} {demand.prenom}</p>
                    </div>
                </div>
                <div className='w-full flex gap-10'>
                    <div className='flex-1 space-y-8'>
                        {demand.demandemanuscrite && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"La demande manuscrite"} initialFile={demand.demandemanuscrite} />
                        )}
                        {demand.copiediplome && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"Copie certifiée du diplôme"} initialFile={demand.copiediplome} />
                        )}
                        {demand.copieattestationhandicap && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"Attestation d’handicap"} initialFile={demand.copieattestationhandicap} />
                        )}
                        {demand.copiearreteequivalencediplome && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"diplôme privé ou étranger"} initialFile={demand.copiearreteequivalencediplome} />
                        )}
                    </div>
                    <div className='flex-1 space-y-8'>
                        {demand.copiecarteidentiterecto && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"CIN Recto"} initialFile={demand.copiecarteidentiterecto} />
                        )}
                        {demand.copiecarteidentiteverso && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"CIN Verso"} initialFile={demand.copiecarteidentiteverso} />
                        )}
                        {demand.copieattestationstatut && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"Pupille de la nation ou ancien combattant et résistant :"} initialFile={demand.copieattestationstatut} />
                        )}
                        {demand.autorisationoncours && (
                            <ImporterFichierFromOracle setFile={setFile} titre={"Autorisation pour passer le concours."} initialFile={demand.autorisationoncours} />
                        )}
                    </div>
                </div>
                <div className='flex justify-end space-x-3 mt-9'>
                    <button
                        type="button"
                        className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-red-600 text-white rounded-lg px-5 py-2"
                        onClick={handleRefuse}
                    >
                        Refusser
                    </button>
                    <button
                        type="button"
                        className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-lg px-5 py-2"
                        onClick={handleAccept}
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
}

import { FiDownload } from 'react-icons/fi';


// function ImporterFichierFromOracle({ spanholder = "Importer le fichier (PDF)", titre, initialFile }) {
//     const fileInputRef = useRef(null);
//     const [fileSelected, setFileSelected] = useState(false);
//     const [fileURL, setFileURL] = useState(null);
//     const [showPDF, setShowPDF] = useState(false);

//     useEffect(() => {
//         if (initialFile) {
//             setFileSelected(true);
//             setFileURL(`data:application/pdf;base64,${initialFile}`);
//         }
//     }, [initialFile]);

//     const handleButtonClick = () => {
//         if (fileSelected) {
//             setShowPDF(!showPDF); // Toggle the PDF display
//         } else {
//             fileInputRef.current.click();
//         }
//     };

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setFileSelected(true);
//             setFileURL(URL.createObjectURL(file));
//             setShowPDF(true); // Show PDF immediately after selecting a file
//         } else {
//             setFileSelected(false);
//             setFileURL(null);
//             setShowPDF(false);
//         }
//     };

//     return (
//         <div>
//             <div>
//                 <p className='pb-2'>{titre}</p>
//             </div>
//             <div>
//                 <button className="buttonD" type="button" onClick={handleButtonClick}>
//                     <span className="buttonD__text">{spanholder}</span>
//                     <span className={`buttonD__icon text-2xl ${fileSelected ? 'text-[#12648e]' : 'text-white'}`}>
//                         <FiDownload />
//                     </span>
//                 </button>
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     style={{ display: 'none' }}
//                     onChange={handleFileChange}
//                     accept=".pdf"
//                 />
//                 {showPDF && fileURL && (
//                     <div className="mt-4 w-full h-96">
//                         <iframe src={fileURL} className="w-full h-full" title="PDF Preview" />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

function ImporterFichierFromOracle({ spanholder = "Importer le fichier (PDF)", titre, initialFile }) {
    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(false);
    const [fileURL, setFileURL] = useState(null);
    const [showPDF, setShowPDF] = useState(false);

    useEffect(() => {
        if (initialFile) {
            setFileSelected(true);
            setFileURL(`data:application/pdf;base64,${initialFile}`);
        }
    }, [initialFile]);

    const handleButtonClick = () => {
        if (fileSelected) {
            // Open the PDF in a new window
            const newWindow = window.open();
            newWindow.document.write(
                `<iframe src="${fileURL}" style="width:100%; height:100%;" frameborder="0"></iframe>`
            );
        } else {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileSelected(true);
            const fileURL = URL.createObjectURL(file);
            setFileURL(fileURL);
            setShowPDF(true); // Show PDF immediately after selecting a file
        } else {
            setFileSelected(false);
            setFileURL(null);
            setShowPDF(false);
        }
    };

    return (
        <div>
            <div>
                <p className='pb-2'>{titre}</p>
            </div>
            <div>
                <button className="buttonD" type="button" onClick={handleButtonClick}>
                    <span className="buttonD__text">{spanholder}</span>
                    <span className={`buttonD__icon text-2xl ${fileSelected ? 'text-[#12648e]' : 'text-white'}`}>
                        <FiDownload />
                    </span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".pdf"
                />
                {showPDF && fileURL && (
                    <div className="mt-4 w-full h-96">
                        <iframe src={fileURL} className="w-full h-full" title="PDF Preview" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImporterFichierFromOracle;
