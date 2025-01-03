import Blob from "./Blob";
import "../App.css"
import DropdownAndRadioForm from "./DropdownAndRadio";
import { CandidatureAccepte, CandidatureRefuser, DomaineSp, EtapesLin, NotExist, Observation } from "./Etapes";
import { FormL, FormS } from "./FormLS";
import { FiDownload } from "react-icons/fi";
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { BiUnderline } from "react-icons/bi";
import Loader from "./loader";

export function MainFirstForm() {
    const [error, setError] = useState(false);

    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <Blob />
            <div className="hidden md:flex flex-1 justify-center flex-col items-center  py-6 px-2 max-w-xl">
                {error ? <NotExist/> : <DomaineSp />}
            </div>
            <div id="formDiv" className="flex flex-1 space-y-5 md:space-y-0 flex-col items-center justify-center max-w-xl py-6 rounded-md px-2">
                <div className="md:hidden">{error ? <NotExist /> : <DomaineSp />}</div>
                <DropdownAndRadioForm setError={setError} />
            </div>
        </div>
    );
}

export function Accepter() {
      return (

            <div id='formDiv' className="flex flex-1 bg-bue-600 justify-center items-center w-full py-6 px-2">
              <CandidatureAccepte/>
            </div>
      ); 
}

export function Refusser() {
  
  return (
  
        <div id='formDiv' className="flex flex-1 bg-bue-600 justify-center items-center w-full py-6 px-2">
          <CandidatureRefuser/>
        </div>
  ); }



export function MainForm() {
  
const location = useLocation();
const {candidature} = location.state || {};
  const [demande, setDemande] = useState(null);

  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(`${localStorage.getItem('authToken')}`);
  const [token, setToken] = useState(null);

  useEffect(() => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
          setToken(storedToken);
      } else {
          setError('Token not found. Please log in again.');
      }
  }, []);

  useEffect(() => {
      if (!token) return;

      const fetchDemandeData = async () => {
          try {
              const response = await fetch('http://localhost:5116/api/Candidature/GetDemandeByUserId', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` // Use token from state
                  }
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const data = await response.json();
              console.log(data);

              // Set the returned data into state variables
              setDemande(data.demande);
              setMessage(data.message);
              setStatus(data.validationStatus);
          } catch (error) {
              setError(error.message);
          }
      };

      fetchDemandeData();
  }, [token]);
  // useEffect(() => {
  //   const fetchDemandeData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5116/api/Candidature/GetDemandeByUserId', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming token is stored in localStorage
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log(data);

  //       // Set the returned data into state variables
  //       setDemande(data.demande);
  //       setMessage(data.message);
  //       setStatus(data.validationStatus);
  //     } catch (error) {
  //       setError(error.message);
  //     } 
  //   };

  //   fetchDemandeData();
  // }, []);
    return (
      <div className="flex flex-col items-center w-full min-h-screen">
        <header className="bg-white/90 text-[#12648e] font-medium m-2 rounded-lg text-xl custom:text-2xl p-4 text-center leading-[40px] max-w-5xl">
          {candidature?.titre}
        </header>
        <Blob />
      <div id='formDiv' className="flex flex-1 bg-bue-600 space-y-8 flex-col items-center w-full py-6 px-2">
        <Form candidature={candidature} demande={demande} status={status} />
        <Observation />
        </div>
      </div>
    );
  }

// export function Form() {

//   const location = useLocation();
//   const { candidature, demande } = location.state || {}; // Use an empty object as fallback
//   const [isChecked, setIsChecked] = useState(false);
//   const [is2Checked, set2IsChecked] = useState(false);
//   const [is3Checked, set3IsChecked] = useState(false);
//   const [is4Checked, set4IsChecked] = useState(false);
//   const [submited,setSubmited] = useState(false);

//   const [prenom, setPrenom] = useState('');
//   const [nom, setNom] = useState('');
//   const [diplome, setDiplome] = useState(null);
//   const [cniRecto, setCniRecto] = useState(null);
//   const [cniVerso, setCniVerso] = useState(null);
//   const [demandeManuscrite, setDemandeManuscrite] = useState(null);
  
//   const [handicap, setHandicap] = useState(null);
//   const [attestation, setAttestation] = useState(null);
//   const [equivalence, setEquivalence] = useState(null);
//   const [autorisation, setAutorisation] = useState(null);
//   const [isSaveDraftEnabled, setIsSaveDraftEnabled] = useState(false);


//   const [errors, setErrors] = useState({});

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   useEffect(() => {
//     if (demande) {
//       setPrenom(demande.prenom || '');
//       setNom(demande.nom || '');
//       setDiplome(demande.copiediplome || null);
//       setCniRecto(demande.copiecarteidentiterecto || null);
//       setCniVerso(demande.copiecarteidentiteverso || null);
//       setDemandeManuscrite(demande.demandemanuscrite || null);
//       setHandicap(demande.copieattestationhandicap || null);
//       setAttestation(demande.copieattestationstatut || null);
//       setEquivalence(demande.copiearreteequivalencediplo || null);
//       setAutorisation(demande.autorisationoncours || null);
  
//       if (demande.copieattestationhandicap) setIsChecked(true);
//       if (demande.copieattestationstatut) set2IsChecked(true);
//       if (demande.copiearreteequivalencediplo) set3IsChecked(true);
//       if (demande.autorisationoncours) set4IsChecked(true);
//     }
//   }, [demande]);
  

//   useEffect(() => {
//     checkIfAnyFieldFilled();
//   }, [prenom, nom, diplome, cniRecto, cniVerso, demandeManuscrite, handicap, attestation, equivalence, autorisation]);

//   const checkIfAnyFieldFilled = () => {
//     if (prenom || nom || diplome || cniRecto || cniVerso || demandeManuscrite || handicap || attestation || equivalence || autorisation) {
//       setIsSaveDraftEnabled(true);
//     } else {
//       setIsSaveDraftEnabled(false);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};

//     if (!prenom) newErrors.prenom = 'Le prénom est requis.';
//     if (!nom) newErrors.nom = 'Le nom est requis.';
//     if (!diplome) newErrors.diplome = 'La copie certifiée du diplôme est requise.';
//     if (!cniRecto) newErrors.cniRecto = 'La copie recto de la carte nationale est requise.';
//     if (!cniVerso) newErrors.cniVerso = 'La copie verso de la carte nationale est requise.';
//     if (!demandeManuscrite) newErrors.demandeManuscrite = 'La demande manuscrite est requise.';

//     if (isChecked && !handicap) newErrors.handicap = "L'attestation de l'handicap est requise.";
//     if (is2Checked && !attestation) newErrors.attestation = "L'attestation justifiant le statut est requise.";
//     if (is3Checked && !equivalence) newErrors.equivalence = "L'arrêté de l'équivalence est requis.";
//     if (is4Checked && !autorisation) newErrors.autorisation = "L'autorisation pour passer le concours est requise.";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//         const formData = new FormData();
//         formData.append('ID_CANDIDATURE', candidature.iD_CANDIDATURE); // Set ID_CANDIDATURE from state
//         formData.append('NOM', nom);
//         formData.append('PRENOM', prenom);
//         formData.append('DEMANDEMANUSCRITE', demandeManuscrite);
//         formData.append('COPIEDIPLOME', diplome);
//         formData.append('COPIECARTEIDENTITERECTO', cniRecto);
//         formData.append('COPIECARTEIDENTITEVERSO', cniVerso);
        
//         if (isChecked) {
//             formData.append('COPIEATTESTATIONHANDICAP', handicap);
//         } else {
//             formData.append('COPIEATTESTATIONHANDICAP', "");
//         }
        
//         if (is2Checked) {
//             formData.append('COPIEATTESTATIONSTATUT', attestation);
//         } else {
//             formData.append('COPIEATTESTATIONSTATUT', "");
//         }

//         if (is3Checked) {
//             formData.append('COPIEARRETEEQUIVALENCEDIPLOME', equivalence);
//         } else {
//             formData.append('COPIEARRETEEQUIVALENCEDIPLOME', "");
//         }

//         if (is4Checked) {
//             formData.append('AUTORISATIONONCOURS', autorisation);
//         } else {
//             formData.append('AUTORISATIONONCOURS', "");
//         }

//         // Log FormData entries
//         for (let pair of formData.entries()) {
//             console.log(pair[0] + ', ' + pair[1]);
//         }

//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//               console.log('Token not found in localStorage');
//           }
//             const response = await fetch('http://localhost:5116/api/demandes', {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 }
//             });

//             if (response.ok) {
//                 console.log("Formulaire soumis avec succès !");
//                 setSubmited(true);
//             } else {
//                 const errorData = await response.json();
//                 console.log("Erreur lors de la soumission du formulaire", errorData);
//             }
//         } catch (error) {
//             console.log("Erreur lors de la soumission du formulaire", error);
//         }
//     }
// };

// const handleSaveDraft = async (event) => {
//   event.preventDefault();
//   const formData = new FormData();
//   formData.append('ID_CANDIDATURE', candidature.iD_CANDIDATURE);
//   formData.append('NOM', nom);
//   formData.append('PRENOM', prenom);
//   if (demandeManuscrite) formData.append('DEMANDEMANUSCRITE', demandeManuscrite);
//   if (diplome) formData.append('COPIEDIPLOME', diplome);
//   if (cniRecto) formData.append('COPIECARTEIDENTITERECTO', cniRecto);
//   if (cniVerso) formData.append('COPIECARTEIDENTITEVERSO', cniVerso);
//   if (handicap) formData.append('COPIEATTESTATIONHANDICAP', handicap);
//   if (attestation) formData.append('COPIEATTESTATIONSTATUT', attestation);
//   if (equivalence) formData.append('COPIEARRETEEQUIVALENCEDIPLOME', equivalence);
//   if (autorisation) formData.append('AUTORISATIONONCOURS', autorisation);

//   try {
//     const token = localStorage.getItem('authToken');
//     const response = await fetch('http://localhost:5116/api/demandes/SaveDraft', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (response.ok) {
//       console.log('Draft saved successfully!');
//     } else {
//       const errorData = await response.json();
//       console.error('Error saving draft:', errorData);
//     }
//   } catch (error) {
//     console.error('Error saving draft:', error);
//   }
// };


//   return (
//     <div id="LgForm" className="backdrop-blur- bg-white/90 max-w-lg w-full custom:max-w-5xl rounded-lg bg-b text-black px-[5vw] py-6">
//       <header className="text-2xl font-medium pb-10 text-[#12648e]">DOSSIER DE CANDIDATURE :</header>
//       <form onSubmit={handleSubmit} className="space-y-9">
//         <div className="flex flex-col space-y-6 custom:space-y-0 custom:flex-row custom:space-x-10">
//           <div className="flex-1">
//             <InputField2
//               name="Prenom"
//               placeholder="Entrez votre prenom"
//               value={prenom}
//               onChange={e => {
//                 setPrenom(e.target.value);
//                 setErrors(prev => ({ ...prev, prenom: '' }));
//               }}
//               error={errors.prenom}
//             />
//           </div>
//           <div className="flex-1">
//             <InputField2
//               name="Nom"
//               placeholder="Entrez votre nom"
//               value={nom}
//               onChange={e => {
//                 setNom(e.target.value);
//                 setErrors(prev => ({ ...prev, nom: '' }));
//               }}
//               error={errors.nom}
//             />
//           </div>
//         </div>
//         <div className="custom:flex space-y-6 custom:space-y-0 custom:space-x-10">
//           <div className="flex-1">
//              <label className="font-light">La demande manuscrite</label><br />
//           <div className="mt-3">
//             <ImporterFichier
//               setFile={file => {
//                 setDemandeManuscrite(file);
//                 setErrors(prev => ({ ...prev, demandeManuscrite: '' }));
//               }}
//               spanholder="Importer le fichier (PDF)"
//               error={errors.demandeManuscrite}
//             />
//           </div>
//           </div>
//           <div className="flex-1">
//             <label className="font-light" htmlFor="Diplome">Copie certifiée du diplôme</label><br />
//             <div className="mt-3">
//               <ImporterFichier
//                 setFile={file => {
//                   setDiplome(file);
//                   setErrors(prev => ({ ...prev, diplome: '' }));
//                 }}
//                 spanholder="Importer le fichier (PDF)"
//                 error={errors.diplome}

//               />
//             </div>
//           </div>
//         </div>
//         <div className="">
//           <p className="flex justify-center font-light">
//             Copie certifiée de la carte nationale d’identité (recto-verso).
//           </p>
//           <div className="custom:flex space-y-6 custom:space-y-0 custom:space-x-10 mt-3">
//             <div className="flex-1">
//               <div className="">
//                 <ImporterFichier
//                   setFile={file => {
//                     setCniRecto(file);
//                     setErrors(prev => ({ ...prev, cniRecto: '' }));
//                   }}
//                   spanholder="Importer copie recto (PDF)"
//                   error={errors.cniRecto}
//                 />
//               </div>
//             </div>
//             <div className="flex-1">
//               <div className="">
//                 <ImporterFichier
//                   setFile={file => {
//                     setCniVerso(file);
//                     setErrors(prev => ({ ...prev, cniVerso: '' }));
//                   }}
//                   spanholder="Importer copie verso (PDF)"
//                   error={errors.cniVerso}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div>
//           <div className="pt-8 flex justify-between items-center">
//             <div>
//               <p>Pour les personnes handicapées :</p>
//             </div>
//             <div className="flex items-center">
//               <label className="switchblue">
//                 <input
//                   type="checkbox"
//                   checked={isChecked}
//                   onChange={(e) => setIsChecked(e.target.checked)}
//                 />
//                 <span className="sliderblue"></span>
//               </label>
//             </div>
//           </div>
//           {isChecked && (
//             <div className="custTransi space-y-2">
//               <p className="font-light">Copie certifiée conforme de l’attestation de l’handicap délivrée par l’autorité gouvernementale chargée des personnes handicapées.</p>
//               <div className="flex justify-center">
//                 <ImporterFichier
//                   setFile={file => {
//                     setHandicap(file);
//                     setErrors(prev => ({ ...prev, handicap: '' }));
//                   }}
//                   spanholder="Importer le fichier (PDF)"
//                   error={errors.handicap}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <div>
//               <p>Pour les pupilles de la nation, les anciens combattants et résistants :</p>
//             </div>
//             <div className="flex items-center">
//               <label className="switchblue">
//                 <input
//                   type="checkbox"
//                   checked={is2Checked}
//                   onChange={(e) => set2IsChecked(e.target.checked)} />
//                 <span className="sliderblue"></span>
//               </label>
//             </div>
//           </div>
//           {is2Checked && (
//             <div className="custTransi space-y-2">
//               <p className="font-light">Copie certifiée conforme de l’attestation justifiant leurs statuts.</p>
//               <div className="flex justify-center">
//                 <ImporterFichier
//                   setFile={file => {
//                     setAttestation(file);
//                     setErrors(prev => ({ ...prev, attestation: '' }));
//                   }}
//                   spanholder="Importer le fichier (PDF)"
//                   error={errors.attestation}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <div>
//               <p>Pour les candidats titulaires d’un diplôme privé ou étranger :</p>
//             </div>
//             <div className="flex items-center">
//               <label className="switchblue">
//                 <input
//                   type="checkbox"
//                   checked={is3Checked}
//                   onChange={(e) => set3IsChecked(e.target.checked)} />
//                 <span className="sliderblue"></span>
//               </label>
//             </div>
//           </div>
//           {is3Checked && (
//             <div className="custTransi space-y-2">
//               <p className="font-light">Copie de l’Arrêté de l’équivalence du diplôme publié dans le bulletin officiel.</p>
//               <div className="flex justify-center">
//                 <ImporterFichier
//                   setFile={file => {
//                     setEquivalence(file);
//                     setErrors(prev => ({ ...prev, equivalence: '' }));
//                   }}
//                   spanholder="Importer le fichier (PDF)"
//                   error={errors.equivalence}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <div className="flex justify-between items-center">
//             <div>
//               <p>Pour les Fonctionnaires :</p>
//             </div>
//             <div className="flex items-center">
//               <label className="switchblue">
//                 <input
//                   type="checkbox"
//                   checked={is4Checked}
//                   onChange={(e) => set4IsChecked(e.target.checked)} />
//                 <span className="sliderblue"></span>
//               </label>
//             </div>
//           </div>
//           {is4Checked && (
//             <div className="custTransi space-y-2">
//               <p className="font-light">Autorisation pour passer le concours.</p>
//               <div className="flex justify-center">
//                 <ImporterFichier
//                   setFile={file => {
//                     setAutorisation(file);
//                     setErrors(prev => ({ ...prev, autorisation: '' }));
//                   }}
//                   spanholder="Importer le fichier (PDF)"
//                   error={errors.autorisation}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <div className={`flex justify-end gap-5 pt-8  ${submited? "hidden" : "block"}`}>
//           <button onClick={handleSaveDraft} disabled={!isSaveDraftEnabled} className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#9ca3af] text-white rounded-xl px-5 py-1">Enregistrer</button>
//           <button type="submit" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-xl px-5 py-2">Postuler</button>
//         </div>
//       </form>
//     </div>
//   );
// }

function InputField2({ name, placeholder, value, onChange, error }) {
  return (
    <>
      <label className="font-light" htmlFor={name}>{name}</label><br />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 text-md font-light text-gray-400 border-0 border-b-[1.2px] border-gray-400 w-full bg-transparent outline-none"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </>
  );
}
// function ImporterFichier({ setFile, spanholder = "Importer le fichier (PDF)", error }) {
//   const fileInputRef = useRef(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [fileSelected, setFileSelected] = useState(false);
//   const [fileName, setFileName] = useState('');

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 1024 * 1024) { // Si le fichier dépasse 1 Mo
//         setErrorMessage('La taille du fichier ne doit pas dépasser 1 Mo.');
//         setFile(null);
//         setFileSelected(false);
//         setFileName('');
//       } else {
//         setErrorMessage(''); // Réinitialiser le message d'erreur si la taille du fichier est acceptable
//         setFile(file);
//         setFileSelected(true);
//         setFileName(file.name);
//       }
//     } else {
//       setFileSelected(false);
//       setFileName('');
//     }
//   };

//   const handleFileClick = () => {
//     const fileURL = URL.createObjectURL(fileInputRef.current.files[0]);
//     window.open(fileURL, '_blank');
//   };

//   return (
//     <div className="flex flex-col items-center w-full">
//       <button className="buttonD" type="button" onClick={handleButtonClick}>
//         <span className="buttonD__text">{spanholder}</span>
//         <span className={`buttonD__icon text-2xl ${fileSelected ? 'text-[#12648e]' : 'text-white'}`}>
//           <FiDownload />
//         </span>
//       </button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//         onChange={handleFileChange}
//         accept=".pdf" // Limiter l'importation aux fichiers PDF
//       />
//       {errorMessage ? (
//         <p className="text-red-500 mt-1">{errorMessage}</p>
//       ) : (
//         error && <p className="text-red-500 mt-1">{error}</p>
//       )}
//       {fileSelected && !errorMessage && (
//         <p className="text-[#12648e] mt-1 cursor-pointer" onClick={handleFileClick}>
//           {fileName}
//         </p>
//       )}
//     </div>
//   );
// }

// export default ImporterFichier;

// export function Form() {
//   const location = useLocation();
//   const { demande } = location.state || {};
//   const [initialFile, setInitialFile] = useState(null);

//   useEffect(() => {
//     if (demande && demande.demandemanuscrite) {
//       // Properly decode the base64 string and create a Blob
//       fetch(`data:application/pdf;base64,${demande.demandemanuscrite}`)
//         .then(res => res.blob())
//         .then(blob => {
//           const file = new File([blob], "demandemanuscrite.pdf", { type: 'application/pdf' });
//           setInitialFile(file);
//         })
//         .catch(error => console.error('Error converting base64 to blob:', error));
//     }
//   }, [demande]);

//   const handleNewFile = (file) => {
//     // Handle new file upload logic
//     console.log('New file uploaded:', file);
//   };

//   return (
//     <div id="LgForm" className="backdrop-blur- bg-white/90 max-w-lg w-full custom:max-w-5xl rounded-lg bg-b text-black px-[5vw] py-6">
//       <header className="text-2xl font-medium pb-10 text-[#12648e]">DOSSIER DE CANDIDATURE :</header>
//       <div className="custom:flex space-y-6 custom:space-y-0 custom:space-x-10">
//         <div className="flex-1">
//           <label className="font-light">La demande manuscrite</label><br />
//           <div className="mt-3">
//             <ImporterFichier
//               setFile={handleNewFile}
//               spanholder="Importer le fichier (PDF)"
//               initialFile={initialFile}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Form;

function ImporterFichier({ setFile, spanholder = "Importer le fichier (PDF)", error, initialFile }) {
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (initialFile) {
      setFileSelected(true);
      setFileName(initialFile.name);
    }
  }, [initialFile]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // Si le fichier dépasse 1 Mo
        setErrorMessage('La taille du fichier ne doit pas dépasser 1 Mo.');
        setFile(null);
        setFileSelected(false);
        setFileName('');
      } else {
        setErrorMessage(''); // Réinitialiser le message d'erreur si la taille du fichier est acceptable
        setFile(file);
        setFileSelected(true);
        setFileName(file.name);
      }
    } else {
      setFileSelected(false);
      setFileName('');
    }
  };

  const handleFileClick = () => {
    const file = initialFile || fileInputRef.current.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
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
        accept=".pdf" // Limiter l'importation aux fichiers PDF
      />
      {errorMessage ? (
        <p className="text-red-500 mt-1">{errorMessage}</p>
      ) : (
        error && <p className="text-red-500 mt-1">{error}</p>
      )}
      {fileSelected && !errorMessage && (
        <p className="text-[#12648e] mt-1 cursor-pointer" onClick={handleFileClick}>
          {fileName}
        </p>
      )}
    </div>
  );
}


export function Form({candidature,demande,status}) {

  // const location = useLocation();
  // const { candidature, demande, status } = location.state || {}; // Use an empty object as fallback
  const [statusExists, setStatusExists] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [is2Checked, set2IsChecked] = useState(false);
  const [is3Checked, set3IsChecked] = useState(false);
  const [is4Checked, set4IsChecked] = useState(false);
  const [submited,setSubmited] = useState(false);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [diplome, setDiplome] = useState(null);
  const [cniRecto, setCniRecto] = useState(null);
  const [cniVerso, setCniVerso] = useState(null);
  const [demandeManuscrite, setDemandeManuscrite] = useState(null);
  
  const [handicap, setHandicap] = useState(null);
  const [attestation, setAttestation] = useState(null);
  const [equivalence, setEquivalence] = useState(null);
  const [autorisation, setAutorisation] = useState(null);
  const [isSaveDraftEnabled, setIsSaveDraftEnabled] = useState(false);
  const [initialDiplomeFile, setInitialDiplomeFile] = useState(null);
const [initialCniRectoFile, setInitialCniRectoFile] = useState(null);
const [initialCniVersoFile, setInitialCniVersoFile] = useState(null);
const [initialDemandeManuscriteFile, setInitialDemandeManuscriteFile] = useState(null);
const [initialHandicapFile, setInitialHandicapFile] = useState(null);
const [initialAttestationFile, setInitialAttestationFile] = useState(null);
const [initialEquivalenceFile, setInitialEquivalenceFile] = useState(null);
const [initialAutorisationFile, setInitialAutorisationFile] = useState(null);


  const [errors, setErrors] = useState({});

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(()=>{
    if(status !== undefined){
      setStatusExists(true);
    }
  },[status]);

  useEffect(() => {
    const decodeBase64File = (base64String, fileName) => {
      return fetch(`data:application/pdf;base64,${base64String}`)
        .then(res => res.blob())
        .then(blob => new File([blob], fileName, { type: 'application/pdf' }))
        .catch(error => {
          console.error('Error converting base64 to blob:', error);
          return null;
        });
    };
  
    if (demande) {
      if (demande.copiediplome) {
        decodeBase64File(demande.copiediplome, "Diplome.pdf").then(setInitialDiplomeFile);
      }
      if (demande.copiecarteidentiterecto) {
        decodeBase64File(demande.copiecarteidentiterecto, "CIN Recto.pdf").then(setInitialCniRectoFile);
      }
      if (demande.copiecarteidentiteverso) {
        decodeBase64File(demande.copiecarteidentiteverso, "CIN Verso.pdf").then(setInitialCniVersoFile);
      }
      if (demande.demandemanuscrite) {
        decodeBase64File(demande.demandemanuscrite, "Demande Manuscrite.pdf").then(setInitialDemandeManuscriteFile);
      }
      if (demande.copieattestationhandicap) {
        decodeBase64File(demande.copieattestationhandicap, "Attestation Handicap.pdf").then(setInitialHandicapFile);
      }
      if (demande.copieattestationstatut) {
        decodeBase64File(demande.copieattestationstatut, "Attestation Status.pdf").then(setInitialAttestationFile);
      }
      if (demande.copiearreteequivalencediplo) {
        decodeBase64File(demande.copiearreteequivalencediplo, "Equivalence.pdf").then(setInitialEquivalenceFile);
      }
      if (demande.autorisationoncours) {
        decodeBase64File(demande.autorisationoncours, "Autorisation.pdf").then(setInitialAutorisationFile);
      }
    }
  }, [demande]);
  

  useEffect(() => {
    if (demande) {
      setPrenom(demande.prenom || '');
      setNom(demande.nom || '');
      setDiplome(demande.copiediplome || null);
      setCniRecto(demande.copiecarteidentiterecto || null);
      setCniVerso(demande.copiecarteidentiteverso || null);
      setDemandeManuscrite(demande.demandemanuscrite || null);
      setHandicap(demande.copieattestationhandicap || null);
      setAttestation(demande.copieattestationstatut || null);
      setEquivalence(demande.copiearreteequivalencediplo || null);
      setAutorisation(demande.autorisationoncours || null);
  
      if (demande.copieattestationhandicap) setIsChecked(true);
      if (demande.copieattestationstatut) set2IsChecked(true);
      if (demande.copiearreteequivalencediplo) set3IsChecked(true);
      if (demande.autorisationoncours) set4IsChecked(true);
    }
  }, [demande]);
  

  useEffect(() => {
    checkIfAnyFieldFilled();
  }, [prenom, nom, diplome, cniRecto, cniVerso, demandeManuscrite, handicap, attestation, equivalence, autorisation]);

  const checkIfAnyFieldFilled = () => {
    if (prenom || nom || diplome || cniRecto || cniVerso || demandeManuscrite || handicap || attestation || equivalence || autorisation) {
      setIsSaveDraftEnabled(true);
    } else {
      setIsSaveDraftEnabled(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newErrors = {};
  
    // Validate required fields
    if (!prenom) newErrors.prenom = 'Le prénom est requis.';
    if (!nom) newErrors.nom = 'Le nom est requis.';
    if (!diplome) newErrors.diplome = 'La copie certifiée du diplôme est requise.';
    if (!cniRecto) newErrors.cniRecto = 'La copie recto de la carte nationale est requise.';
    if (!cniVerso) newErrors.cniVerso = 'La copie verso de la carte nationale est requise.';
    if (!demandeManuscrite) newErrors.demandeManuscrite = 'La demande manuscrite est requise.';
  
    if (isChecked && !handicap) newErrors.handicap = "L'attestation de l'handicap est requise.";
    if (is2Checked && !attestation) newErrors.attestation = "L'attestation justifiant le statut est requise.";
    if (is3Checked && !equivalence) newErrors.equivalence = "L'arrêté de l'équivalence est requis.";
    if (is4Checked && !autorisation) newErrors.autorisation = "L'autorisation pour passer le concours est requise.";
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append('ID_CANDIDATURE', candidature.iD_CANDIDATURE); // Always send ID_CANDIDATURE
  
      // Append only changed fields
      if (prenom !== (demande?.prenom || '')) formData.append('PRENOM', prenom);
      if (nom !== (demande?.nom || '')) formData.append('NOM', nom);
      if (diplome && !isBase64(diplome)) formData.append('COPIEDIPLOME', diplome);
      if (cniRecto && !isBase64(cniRecto)) formData.append('COPIECARTEIDENTITERECTO', cniRecto);
      if (cniVerso && !isBase64(cniVerso)) formData.append('COPIECARTEIDENTITEVERSO', cniVerso);
      if (demandeManuscrite && !isBase64(demandeManuscrite)) formData.append('DEMANDEMANUSCRITE', demandeManuscrite);
  
      if (isChecked) {
        if (handicap && !isBase64(handicap)) formData.append('COPIEATTESTATIONHANDICAP', handicap);
      } else {
        if (initialHandicapFile) formData.append('COPIEATTESTATIONHANDICAP', ""); // Clear the field if unchecked
      }
  
      if (is2Checked) {
        if (attestation && !isBase64(attestation)) formData.append('COPIEATTESTATIONSTATUT', attestation);
      } else {
        if (initialAttestationFile) formData.append('COPIEATTESTATIONSTATUT', ""); // Clear the field if unchecked
      }
  
      if (is3Checked) {
        if (equivalence && !isBase64(equivalence)) formData.append('COPIEARRETEEQUIVALENCEDIPLOME', equivalence);
      } else {
        if (initialEquivalenceFile) formData.append('COPIEARRETEEQUIVALENCEDIPLOME', ""); // Clear the field if unchecked
      }
  
      if (is4Checked) {
        if (autorisation && !isBase64(autorisation)) formData.append('AUTORISATIONONCOURS', autorisation);
      } else {
        if (initialAutorisationFile) formData.append('AUTORISATIONONCOURS', ""); // Clear the field if unchecked
      }
  
      // Log FormData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
  
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('Token not found in localStorage');
        }
  
        const response = await fetch('http://localhost:5116/api/demandes', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          console.log("Formulaire soumis avec succès !");
          setSubmited(true);
        } else {
          const errorData = await response.json();
          console.log("Erreur lors de la soumission du formulaire", errorData);
        }
      } catch (error) {
        console.log("Erreur lors de la soumission du formulaire", error);
      }
    }
  };
  
  // Helper function to check if a value is a base64 encoded string
  const isBase64 = (value) => {
    const base64Pattern = /^([A-Za-z0-9+/=]+)$/;
    return base64Pattern.test(value);
  };
  
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newErrors = {};

//     if (!prenom) newErrors.prenom = 'Le prénom est requis.';
//     if (!nom) newErrors.nom = 'Le nom est requis.';
//     if (!diplome) newErrors.diplome = 'La copie certifiée du diplôme est requise.';
//     if (!cniRecto) newErrors.cniRecto = 'La copie recto de la carte nationale est requise.';
//     if (!cniVerso) newErrors.cniVerso = 'La copie verso de la carte nationale est requise.';
//     if (!demandeManuscrite) newErrors.demandeManuscrite = 'La demande manuscrite est requise.';

//     if (isChecked && !handicap) newErrors.handicap = "L'attestation de l'handicap est requise.";
//     if (is2Checked && !attestation) newErrors.attestation = "L'attestation justifiant le statut est requise.";
//     if (is3Checked && !equivalence) newErrors.equivalence = "L'arrêté de l'équivalence est requis.";
//     if (is4Checked && !autorisation) newErrors.autorisation = "L'autorisation pour passer le concours est requise.";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//         const formData = new FormData();
//         formData.append('ID_CANDIDATURE', candidature.iD_CANDIDATURE); // Set ID_CANDIDATURE from state
//         formData.append('NOM', nom);
//         formData.append('PRENOM', prenom);
//         formData.append('DEMANDEMANUSCRITE', demandeManuscrite);
//         formData.append('COPIEDIPLOME', diplome);
//         formData.append('COPIECARTEIDENTITERECTO', cniRecto);
//         formData.append('COPIECARTEIDENTITEVERSO', cniVerso);
        
//         if (isChecked) {
//             formData.append('COPIEATTESTATIONHANDICAP', handicap);
//         } else {
//             formData.append('COPIEATTESTATIONHANDICAP', "");
//         }
        
//         if (is2Checked) {
//             formData.append('COPIEATTESTATIONSTATUT', attestation);
//         } else {
//             formData.append('COPIEATTESTATIONSTATUT', "");
//         }

//         if (is3Checked) {
//             formData.append('COPIEARRETEEQUIVALENCEDIPLOME', equivalence);
//         } else {
//             formData.append('COPIEARRETEEQUIVALENCEDIPLOME', "");
//         }

//         if (is4Checked) {
//             formData.append('AUTORISATIONONCOURS', autorisation);
//         } else {
//             formData.append('AUTORISATIONONCOURS', "");
//         }

//         // Log FormData entries
//         for (let pair of formData.entries()) {
//             console.log(pair[0] + ', ' + pair[1]);
//         }

//         try {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//               console.log('Token not found in localStorage');
//           }
//             const response = await fetch('http://localhost:5116/api/demandes', {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 }
//             });

//             if (response.ok) {
//                 console.log("Formulaire soumis avec succès !");
//                 setSubmited(true);
//             } else {
//                 const errorData = await response.json();
//                 console.log("Erreur lors de la soumission du formulaire", errorData);
//             }
//         } catch (error) {
//             console.log("Erreur lors de la soumission du formulaire", error);
//         }
//     }
// };

const handleSaveDraft = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('ID_CANDIDATURE', candidature.iD_CANDIDATURE);
  formData.append('NOM', nom);
  formData.append('PRENOM', prenom);
  if (demandeManuscrite) formData.append('DEMANDEMANUSCRITE', demandeManuscrite);
  if (diplome) formData.append('COPIEDIPLOME', diplome);
  if (cniRecto) formData.append('COPIECARTEIDENTITERECTO', cniRecto);
  if (cniVerso) formData.append('COPIECARTEIDENTITEVERSO', cniVerso);
  if (handicap) formData.append('COPIEATTESTATIONHANDICAP', handicap);
  if (attestation) formData.append('COPIEATTESTATIONSTATUT', attestation);
  if (equivalence) formData.append('COPIEARRETEEQUIVALENCEDIPLOME', equivalence);
  if (autorisation) formData.append('AUTORISATIONONCOURS', autorisation);

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:5116/api/demandes/SaveDraft', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log('Draft saved successfully!');
    } else {
      const errorData = await response.json();
      console.error('Error saving draft:', errorData);
    }
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};


  return (
    <div id="LgForm" className="backdrop-blur- bg-white/90 max-w-lg w-full custom:max-w-5xl rounded-lg bg-b text-black px-[5vw] py-6">
      <header className=" pb-10">
        { statusExists && status === -1 && <div className="pt-4 pb-12">
             <h1 className="text-red-600 text-4xl font-semibold">Désolé !</h1>
             <p className="text-lg  pt-1  ">Merci de votre intérêt pour le CHU Hassan II. Malheureusement,<span className="text-red-600"> votre candidature n'a pas été retenue cette fois. </span></p>
        </div>}

        { statusExists && status === 1 &&
         <div className="pt-4 pb-12">
        <h1 className="text-green-600 text-4xl font-semibold">Félicitations !</h1>
        <p className="font-normal   pt-1  ">Votre <span className="text-green-600">candidature a été acceptée </span> et vous avez été sélectionné pour passer un concours présentiel.</p>
        </div>}
        { demande?.etat === 1 && statusExists && status === 0 || submited ?  <div className="pt-4 pb-12">
            <h1 className="text-yellow-600 text-4xl font-semibold">En Étude</h1>
            <p className="font-normal pt-1">Votre <span className="text-yellow-600">demande est en cours d'étude</span>. Veuillez patienter pour une mise à jour.</p>
        </div> : null}
        <p className="text-2xl font-medium text-[#12648e]"> DOSSIER DE CANDIDATURE : </p>
        </header>
      <form onSubmit={handleSubmit} className={`space-y-9 ${ submited || (demande?.etat === 1) ? "pointer-events-none" : ""} `} >

        <div className="flex flex-col space-y-6 custom:space-y-0 custom:flex-row custom:space-x-10">
          <div className="flex-1">
            <InputField2
              name="Prenom"
              placeholder="Entrez votre prenom"
              value={prenom}
              onChange={e => {
                setPrenom(e.target.value);
                setErrors(prev => ({ ...prev, prenom: '' }));
              }}
              error={errors.prenom}
            />
          </div>
          <div className="flex-1 ">
            <InputField2
              name="Nom"
              placeholder="Entrez votre nom"
              value={nom}
              onChange={e => {
                setNom(e.target.value);
                setErrors(prev => ({ ...prev, nom: '' }));
              }}
              error={errors.nom}
            />
          </div>
        </div>
        <div className="custom:flex space-y-6 custom:space-y-0 custom:space-x-10">
          <div className="flex-1">
             <label className="font-light">La demande manuscrite</label><br />
          <div className="mt-3">
            <ImporterFichier
              setFile={file => {
                setDemandeManuscrite(file);
                setErrors(prev => ({ ...prev, demandeManuscrite: '' }));
              }}
              spanholder="Importer le fichier (PDF)"
              error={errors.demandeManuscrite}
              initialFile={initialDemandeManuscriteFile}
            />
          </div>
          </div>
          <div className="flex-1">
            <label className="font-light" htmlFor="Diplome">Copie certifiée du diplôme</label><br />
            <div className="mt-3">
              <ImporterFichier
                setFile={file => {
                  setDiplome(file);
                  setErrors(prev => ({ ...prev, diplome: '' }));
                }}
                spanholder="Importer le fichier (PDF)"
                error={errors.diplome}
                initialFile={initialDiplomeFile}
              />
            </div>
          </div>
        </div>
        <div className="">
          <p className="flex justify-center font-light">
            Copie certifiée de la carte nationale d’identité (recto-verso).
          </p>
          <div className="custom:flex space-y-6 custom:space-y-0 custom:space-x-10 mt-3">
            <div className="flex-1">
              <div className="">
                <ImporterFichier
                  setFile={file => {
                    setCniRecto(file);
                    setErrors(prev => ({ ...prev, cniRecto: '' }));
                  }}
                  spanholder="Importer copie recto (PDF)"
                  error={errors.cniRecto}
                  initialFile={initialCniRectoFile}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="">
                <ImporterFichier
                  setFile={file => {
                    setCniVerso(file);
                    setErrors(prev => ({ ...prev, cniVerso: '' }));
                  }}
                  spanholder="Importer copie verso (PDF)"
                  error={errors.cniVerso}
                  initialFile={initialCniVersoFile}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="pt-8 flex justify-between items-center">
            <div>
              <p>Pour les personnes handicapées :</p>
            </div>
            <div className="flex items-center">
              <label className="switchblue">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="sliderblue"></span>
              </label>
            </div>
          </div>
          {isChecked && (
            <div className="custTransi space-y-2">
              <p className="font-light">Copie certifiée conforme de l’attestation de l’handicap délivrée par l’autorité gouvernementale chargée des personnes handicapées.</p>
              <div className="flex justify-center">
                <ImporterFichier
                  setFile={file => {
                    setHandicap(file);
                    setErrors(prev => ({ ...prev, handicap: '' }));
                  }}
                  spanholder="Importer le fichier (PDF)"
                  error={errors.handicap}
                  initialFile={initialHandicapFile}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p>Pour les pupilles de la nation, les anciens combattants et résistants :</p>
            </div>
            <div className="flex items-center">
              <label className="switchblue">
                <input
                  type="checkbox"
                  checked={is2Checked}
                  onChange={(e) => set2IsChecked(e.target.checked)} />
                <span className="sliderblue"></span>
              </label>
            </div>
          </div>
          {is2Checked && (
            <div className="custTransi space-y-2">
              <p className="font-light">Copie certifiée conforme de l’attestation justifiant leurs statuts.</p>
              <div className="flex justify-center">
                <ImporterFichier
                  setFile={file => {
                    setAttestation(file);
                    setErrors(prev => ({ ...prev, attestation: '' }));
                  }}
                  spanholder="Importer le fichier (PDF)"
                  error={errors.attestation}
                  initialFile={initialAttestationFile}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p>Pour les candidats titulaires d’un diplôme privé ou étranger :</p>
            </div>
            <div className="flex items-center">
              <label className="switchblue">
                <input
                  type="checkbox"
                  checked={is3Checked}
                  onChange={(e) => set3IsChecked(e.target.checked)} />
                <span className="sliderblue"></span>
              </label>
            </div>
          </div>
          {is3Checked && (
            <div className="custTransi space-y-2">
              <p className="font-light">Copie de l’Arrêté de l’équivalence du diplôme publié dans le bulletin officiel.</p>
              <div className="flex justify-center">
                <ImporterFichier
                  setFile={file => {
                    setEquivalence(file);
                    setErrors(prev => ({ ...prev, equivalence: '' }));
                  }}
                  spanholder="Importer le fichier (PDF)"
                  error={errors.equivalence}
                  initialFile={initialEquivalenceFile}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p>Pour les Fonctionnaires :</p>
            </div>
            <div className="flex items-center">
              <label className="switchblue">
                <input
                  type="checkbox"
                  checked={is4Checked}
                  onChange={(e) => set4IsChecked(e.target.checked)} />
                <span className="sliderblue"></span>
              </label>
            </div>
          </div>
          {is4Checked && (
            <div className="custTransi space-y-2">
              <p className="font-light">Autorisation pour passer le concours.</p>
              <div className="flex justify-center">
                <ImporterFichier
                  setFile={file => {
                    setAutorisation(file);
                    setErrors(prev => ({ ...prev, autorisation: '' }));
                  }}
                  spanholder="Importer le fichier (PDF)"
                  error={errors.autorisation}
                  initialFile={initialAutorisationFile}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className={`flex justify-end gap-5 pt-8  ${ submited || (demande?.etat === 1) ? "hidden" : "block"}`}>
          <button onClick={handleSaveDraft} disabled={!isSaveDraftEnabled} className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#9ca3af] text-white rounded-xl px-5 py-1">Enregistrer</button>
          <button type="submit" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-xl px-5 py-2">Postuler</button>
        </div> 
        
      </form>
    </div>
  );
}
