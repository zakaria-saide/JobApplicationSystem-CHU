import '../App.css';
import { EtapesSup, EtapesLin } from './Etapes';
import { useState, useEffect } from 'react';
import Blob from './Blob';
import { FelicitationsInter, FormL, FormS } from './FormLS';
import Loader from './loader';


// export default function LinSup({ defaultLoginActive = false }) {
//     const [isLoginActive, setIsLoginActive] = useState(defaultLoginActive);
//     const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

//     const handleRegistrationSuccess = () => {
//         setIsRegistrationSuccess(true);
//     };

//     const handleRetourner = () => {
//         setIsRegistrationSuccess(false);
//         setIsLoginActive(true);
//     };

//     useEffect(() => {
//         setIsLoginActive(defaultLoginActive);
//     }, [defaultLoginActive]);

//     return (
//         <div className="flex justify-center items-center w-full min-h-screen">
//             <Blob />
//             {isRegistrationSuccess ? (
//                 <FelicitationsInter onRetourner={handleRetourner} />
//             ) : (
//                 <>
//                     <div className="hidden md:flex flex-1 justify-center flex-col items-center bg-gren-500 py- px-2 max-w-xl">
//                         <header className='absolute top-0 left-0 m-2'>
//                             <div className='rounded-md bg-white/70'>
//                                 <img src="src/img/ChuLogo.png" alt="CHU Logo" className='max-w-[20vw]'/>
//                             </div>
//                         </header>
//                         {isLoginActive ? <EtapesLin /> : <EtapesSup />}
//                     </div>
//                     <div id='formDiv' className="flex flex-1 space-y-5 md:space-y-0 flex-col items-center justify-center max-w-xl my-4 rounded-md px-2">
//                         <div className='md:hidden'>
//                             <header className='m-3 flex justify-center '>
//                                 <div className='rounded-md bg-white/70'>
//                                     <img src="src/img/ChuLogo.png" alt="CHU Logo" className='max-w-[40vw]'/>
//                                 </div>
//                             </header>
//                         </div>
//                         {isLoginActive ? (
//                             <FormL onSwitch={() => setIsLoginActive(false)} />
//                         ) : (
//                             <FormS onSwitch={() => setIsLoginActive(true)} onRegistrationSuccess={handleRegistrationSuccess} />
//                         )}
//                         <div className='md:hidden'>
//                             {isLoginActive ? <EtapesLin /> : <EtapesSup />}
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }


export default function LinSup({ defaultLoginActive = false }) {
    const [isLoginActive, setIsLoginActive] = useState(defaultLoginActive);
    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegistrationSuccess = () => {
        setIsRegistrationSuccess(true);
    };

    const handleRetourner = () => {
        setIsRegistrationSuccess(false);
        setIsLoginActive(true);
    };

    useEffect(() => {
        setIsLoginActive(defaultLoginActive);
    }, [defaultLoginActive]);

    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <Blob />
            
                {isRegistrationSuccess ? (
                    <FelicitationsInter onRetourner={handleRetourner} />
                ) : (
                    <>
                        <div className="hidden md:flex flex-1 justify-center flex-col items-center bg-gren-500 py- px-2 max-w-xl">
                            <header className='absolute top-0 left-0 m-2'>
                                <div className='rounded-md bg-white/70'>
                                    <img src="src/img/ChuLogo.png" alt="CHU Logo" className='max-w-[20vw]'/>
                                </div>
                            </header>
                            {isLoginActive ? <EtapesLin /> : <EtapesSup />}
                        </div>
                        <div id='formDiv' className="flex flex-1 space-y-5 md:space-y-0 flex-col items-center justify-center max-w-xl my-4 rounded-md px-2">
                            <div className='md:hidden'>
                                <header className='m-3 flex justify-center '>
                                    <div className='rounded-md bg-white/70'>
                                        <img src="src/img/ChuLogo.png" alt="CHU Logo" className='max-w-[40vw]'/>
                                    </div>
                                </header>
                            </div>
                                <div className={`${isLoading ? 'block' : 'hidden'}`}>    
                                    <Loader />
                                </div>
                                <div>
                                    {isLoginActive ? (
                                        <div className={`${!isLoading ? 'block' : 'hidden'}`}>
                                            <FormL onSwitch={() => setIsLoginActive(false)} />
                                        </div>
                                    ) : (
                                        <div className={`${!isLoading ? 'block' : 'hidden'}`}>
                                            <FormS onSwitch={() => setIsLoginActive(true)} onRegistrationSuccess={handleRegistrationSuccess} setIsLoading={setIsLoading}/>
                                        </div>
                                    )}
                                </div>
                                <div className='md:hidden max-w-sm'>
                                    {isLoginActive ? <EtapesLin /> : <EtapesSup />}
                                </div>

                        </div>
                    </>
                
            )}
        </div>
    );
}