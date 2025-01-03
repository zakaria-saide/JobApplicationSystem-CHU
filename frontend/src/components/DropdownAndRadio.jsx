import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import professionsData from './ProfessionData';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function DropdownAndRadioForm({ setError }) {
    const [domain, setDomain] = useState('Sante');
    const [professions, setProfessions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Choisir votre profession');
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setProfessions(professionsData.filter(prof => prof.domain === domain));
    }, [domain]);

    useEffect(() => {
        setIsOptionSelected(selectedOption !== 'Choisir votre profession');
    }, [selectedOption]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (profession) => {
        setSelectedOption(profession.name);
        setIsOpen(false);
    };

    const handleDomainChange = (newDomain) => {
        setDomain(newDomain);
    };

    // const handleSuivantClick = (event) => {
    //     event.preventDefault();
    
    //     if (isOptionSelected) {
    //         const token = localStorage.getItem('authToken');
    //         console.log('Token:', token); // Log the token to check if it's retrieved correctly
    
    //         fetch(`http://localhost:5116/api/Candidature?profession=${selectedOption}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then(response => {
    //             console.log('Response status:', response.status); // Log the response status
    //             if (!response.ok) {
    //                 if (response.status === 404) {
    //                     setError(true);
    //                     throw new Error('Candidature not found');
    //                 } else {
    //                     throw new Error('Network response was not ok');
    //                 }
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             console.log('Response data:', data); // Log the response data
    //             const { candidature, message } = data;
    //             console.log('Candidature:', candidature); // Log the candidature object
    //             console.log('Message:', message); // Log the message
    
    //             // Update the state and navigate
    //             navigate('/LogIn/Domain/Candidacy', { state: { candidature } });
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    //     }
    // };
    
    const handleSuivantClick = (event) => {
        event.preventDefault();
    
        if (isOptionSelected) {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token); // Log the token to check if it's retrieved correctly
    
            fetch(`http://localhost:5116/api/Candidature?profession=${selectedOption}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('Response status:', response.status); // Log the response status
                if (!response.ok) {
                    if (response.status === 404) {
                        setError(true);
                        throw new Error('Candidature not found');
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                const { candidature} = data;
                console.log('Candidature:', candidature);
                navigate('/LogIn/Domain/Candidacy', { state: { candidature} });
            })
           
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
    
    
    return (
        <div id="LgForm" className="backdrop-blur- bg-white/95 max-w-md  rounded-lg bg-b  text-black px-8 py-4">
            <h1 className="text-[#12648e] text-3xl font-semibold">Informations generaux</h1>
            <form id="lgForm" className=" flex flex-col mt-4 w-full"> 
                <div>
                    <label className="text-lg">Domaine</label>
                    <div>
                        <RadioInput selected={domain} onChange={handleDomainChange} />
                    </div>
                </div>
                <div className="mt-5 flex flex-col">
                    <label className="text-lg mb-4">Profession</label>
                    <Dropdown isOpen={isOpen} toggleDropdown={toggleDropdown} professions={professions} selectedOption={selectedOption} onOptionClick={handleOptionClick} />
                </div>
                <div className="flex justify-end mt-6">
                    {isOptionSelected && (
                        <button onClick={handleSuivantClick} className="font-medium bg-[#12648e] text-white rounded-xl px-5 py-2 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]">Suivant</button>
                    )}
                </div>
            </form>
        </div>
    );
}

export function DropdownRsHmRadioForm({ selectedProfession, onProfessionChange }) {
    const [domain, setDomain] = useState('Sante');
    const [professions, setProfessions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setProfessions(professionsData.filter(prof => prof.domain === domain));
    }, [domain]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (profession) => {
        onProfessionChange(profession.name);
        setIsOpen(false);
    };

    const handleDomainChange = (newDomain) => {
        setDomain(newDomain);
        onProfessionChange(''); // Reset profession when domain changes
    };

    return (
        <div className='space-y-5'>
            <div>
                <label className="space-y-3">Domaine</label>
                <div>
                    <RadioInput selected={domain} onChange={handleDomainChange} />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-">Profession</label>
                <Dropdown 
                    isOpen={isOpen} 
                    toggleDropdown={toggleDropdown} 
                    professions={professions} 
                    selectedOption={selectedProfession} 
                    onOptionClick={handleOptionClick} 
                />
            </div>
        </div>
    );
}

export function RadioInput({ selected, onChange }) {
    return (
        <div className="radio-inputs mt-4 w-full">
            <label className="radio">
                <input type="radio" name="radio" checked={selected === 'Sante'} onChange={() => onChange('Sante')} />
                <span className="name">Sante</span>
            </label>
            <label className="radio">
                <input type="radio" name="radio" checked={selected === 'Administratif'} onChange={() => onChange('Administratif')} />
                <span className="name">Administratif</span>
            </label>
        </div>
    );
}

export function Dropdown({ isOpen, toggleDropdown, professions, selectedOption, onOptionClick }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between bg-white px-2 py-3.5 rounded-lg shadow cursor-pointer" onClick={toggleDropdown}>
                <span className='text-sm pl-3 font-semibold'>{selectedOption || 'Choisir votre profession'}</span>
                <IconContext.Provider value={{ className: "text-lg" }}>
                    {isOpen ? <BsChevronUp /> : <BsChevronDown />}
                </IconContext.Provider>
            </div>
            {isOpen && (
                <ul className="w-full bg-[#f3f4f6] mt-2 rounded-md shadow z-10">
                    {professions.map((profession, index) => (
                        <li key={index} onClick={() => onOptionClick(profession)}
                            className="flex text-sm items-center px-5 py-2 hover:bg-white cursor-pointer">
                            <span className="ml-4">{profession.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
}
