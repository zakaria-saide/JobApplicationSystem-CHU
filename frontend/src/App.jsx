import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LinSup from './components/MainLinSup';
import { Form, MainFirstForm, MainForm } from './components/MainForms';
import { DemandHumainRessouceInterface, DemandUserInfo, HumainRessouceInterface, LancerCandidatureForm } from './components/HumainRessources';
import Blob from './components/Blob';

function App() {
    const isAuthenticated = !!localStorage.getItem('authToken');
    return (
        // <MainForm/>

        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/SignUp" />} />
                <Route path="/LogIn/Admin" element={ <HumainRessouceInterface/>  } />
                <Route path="/LogIn/Admin/Demand" element={ <DemandHumainRessouceInterface/>  } />
                <Route path="/LogIn/Status" element={isAuthenticated ? <MainForm/> : <Navigate to="/LogIn" />} />
                <Route path="/LogIn/Admin/Demand/UserInfo" element={<DemandUserInfo />} />
                <Route path="/SignUp" element={<LinSup defaultLoginActive={false} />} />
                <Route path="/LogIn" element={<LinSup defaultLoginActive={true} />} />
                <Route path="/LogIn/Domain" element={isAuthenticated ? <MainFirstForm /> : <Navigate to="/LogIn" />} />
                <Route path="/LogIn/Domain/Candidacy" element={isAuthenticated ? <MainForm/> : <Navigate to="/LogIn" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>

    );
}

import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    const handleReturnClick = () => {
        navigate('/'); // Remplacez '/' par l'URL par défaut vers laquelle vous voulez rediriger
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen">  
            <Blob />
            <div id='formDiv' className="flex flex- bg-bue-600 space-y-8 justify-center items-center w-full py-6 px-2">
                <div id="Etapes" className="bg-white/90 p-4 rounded-md max-w-[550px]">
                    <h1 className="text-[#12648e] text-6xl font-semibold">Oups !</h1>
                    <p className="font-normal text-lg pt-4">La page que vous cherchez semble avoir été déplacée ou n'existe plus.</p>
                    <div className="pl-10">
                        <div className="mt-10 flex items-center gap-2">
                            <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                            <p>Vous pouvez retourner à notre page d'accueil en cliquant sur le bouton suivant</p>
                        </div>
                        <div className="mt-10 mb-5 flex justify-center">
                            <button
                                onClick={handleReturnClick}
                                className="font-medium bg-[#12648e] text-white rounded-xl px-5 py-2 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]"
                            >
                                Retourner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
