import { HiMiniExclamationCircle } from "react-icons/hi2";
import { useState,React } from "react";
import Blob from "./Blob";
import { useNavigate } from 'react-router-dom';


// export  function FormS({onSwitch}){
//     return (
//         <div id="LgForm" className="backdrop-blur- bg-white/95 max-w-md  rounded-lg bg-b  text-black px-8 py-4">
//                 <h1 className="text-[#12648e] text-3xl font-semibold">Creer un compte</h1>
//                 <p className="font-normal text-md max-w-xl pt-1.5">Bienvenue, inscrivez-vous et soumettez votre candidature aux concours du Centre Hospitalier Universitaire de Fès.</p>
//             <form id="lgForm" className=" flex flex-col mt-8"> 
//             <div>
//                 <label className="font-light" htmlFor="Email">Email</label><br/>
//                 <input type="email" id="Email"  placeholder="Entrer votre email" className="mt-2 w-full font-light text-gray-400 border-0   border-gray-400 py-2 bg-transparent outline-none"/>
//             </div>
//             <div className="mt-8">
//                 <label className="font-light" htmlFor="motsdepasse">Mots de passe</label><br/>
//                 <input type="password" id="motsdepasse"  placeholder="Entrer votre mots de passe" className="mt-2 w-full font-light text-gray-400 border-0   border-gray-400 py-2 bg-transparent outline-none"/>
//             </div>
//             <div className="mt-8">
//                 <label className="font-light" htmlFor="cmotsdepasse">Confirmer le mots de passe</label><br/>
//                 <input type="password" id="cmotsdepasse"  placeholder="Confirmer votre mots de passe" className="mt-2 w-full font-light text-gray-400 border-0   border-gray-400 py-2 bg-transparent outline-none"/>
//             </div> 
//             <div className="flex justify-between items-center "> 
//                 <p onClick={onSwitch}  className=" hover:scale-[1.02]  mt-10 mb-4 font-medium  text-[#12648e] cursor-pointer py-1 underline">J'ai deja un compte</p>
//                 <button type="button" className=" active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]  mt-10 mb-4 font-medium bg-[#12648e] text-white rounded-2xl px-5 py-1">Creer</button>
//             </div>
//             </form>
            
//         </div>
//     );
// }




export function FormL({ onSwitch }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Tous les champs doivent être remplis');
            return;
        }

        try {
            const response = await fetch('http://localhost:5116/api/Login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            const responseText = await response.text();
            let data;

            try {
                data = JSON.parse(responseText);
            } catch (err) {
                throw new Error("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
            }

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }
            console.log(data);
            localStorage.setItem('authToken', data.token);
            if (data.role === 1) {
                if (data.demande) {
                    // Redirect the user to /LogIn/Status
                    navigate('/LogIn/Status', { state: { demande: data.demande, candidature: data.candidature } });
                } else {
                    // Redirect the user to /LogIn/Domain
                    navigate('/LogIn/Domain');
                }
            } else if (data.role === 2) {
                // Redirect the user to /login/Admin
                navigate('/LogIn/Admin');
            } else {
                // Handle unexpected role values or no role provided
                navigate('/NotFound');
            }
            
            // Store the auth token in localStorage
            
            // Redirect the user to /LogIn/Domain
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = () => {
        if (error) {
            setError('');
        }
    };

    return (
        <div id="LgForm" className="backdrop-blur- bg-white/95 max-w-md rounded-lg bg-b text-black px-8 py-4">
            <h1 className="text-[#12648e] text-3xl font-semibold">Se connecter</h1>
            <p className="font-normal text-md max-w-xl pt-1.5">
                Bienvenue sur la plateforme de candidature du Centre Hospitalier Universitaire de Fès. Connectez-vous, soumettez votre candidature aux concours et restez informé du statut de votre candidature.
            </p>
            <form id="lgForm" className="flex flex-col mt-8" onSubmit={handleSubmit}>
                <div>
                    <label className="font-light" htmlFor="Email">Email</label><br />
                    <input
                        type="email"
                        id="Email"
                        placeholder="Entrer votre email"
                        className="mt-2 w-full font-light text-gray-400 border-0 border-gray-400 py-2 bg-transparent outline-none"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
                    />
                </div>
                <div className="mt-8">
                    <label className="font-light" htmlFor="motsdepasse">Mot de passe</label><br />
                    <input
                        type="password"
                        id="motsdepasse"
                        placeholder="Entrer votre mot de passe"
                        className="mt-2 w-full font-light text-gray-400 border-0 border-gray-400 py-2 bg-transparent outline-none"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                    />
                </div>
                {error && (
                    <div className="pt-3">
                        <label htmlFor="" className="text-red-600 text-sm">{error}</label>
                    </div>
                )}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="my-10 font-medium bg-[#12648e] text-white rounded-2xl px-5 py-2 active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05]"
                    >
                        Se connecter
                    </button>
                </div>

                <div className="flex justify-between items-center cursor-pointer font-medium">
                    <p onClick={onSwitch} className="text-[#12648e] hover:scale-[1.02] underline">Je n'ai pas un compte</p>
                    <p className="hover:scale-[1.02] underline text-gray-400">Mot de passe oublié</p>
                </div>
            </form>
        </div>
    );
}






// function InputField({ name, placeholder, error, isValid, onChange, onBlur }) {
//     return (
//         <div>
//             <label className={`font-light mr-2 ${!isValid && error && 'text-red-600'}`} htmlFor={name}>{name}</label>
//             <input
//                 type={name === 'Email' ? 'email' : 'password'}
//                 id={name}
//                 name={name}
//                 placeholder={placeholder}
//                 className={`mt-2 w-full font-light text-gray-400 py-2 bg-transparent outline-none ${!isValid && error && 'border-red-600'}`}
//                 onChange={onChange}
//                 onBlur={onBlur}
//             />
//             {!isValid && error && (
//                 <div className="absolute mt-1">
//                     <div className="flex items-center text-red-600">
//                         <div className="text-md">
//                             <HiMiniExclamationCircle />
//                         </div>
//                         <p className="text-sm text-red-600 ml-1">{error}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

function InputField({ name, placeholder, error, isValid, onChange, onBlur, onKeyDown }) {
    return (
        <div className="relative">
            <label className={`font-light mr-2 ${!isValid && error && 'text-red-600'}`} htmlFor={name}>{name}</label>
            <input
                type={name === 'Email' ? 'text' : 'password'}
                id={name}
                name={name}
                placeholder={placeholder}
                className={`mt-2 w-full font-light text-gray-400 py-2 bg-transparent outline-none ${!isValid && error && 'border-red-600'}`}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
            {!isValid && error && (
                <div className="absolute mt-1">
                    <div className="flex items-center text-red-600">
                        <div className="text-md">
                            <HiMiniExclamationCircle />
                        </div>
                        <p className="text-sm text-red-600 ml-1">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}


export function FelicitationsInter({ onRetourner }) {
    return (
        <div>
            <div id="felicitations" className="flex flex-col bg-white/90 p-4 m-3 rounded-md">
                <h1 className="text-[#12648e] text-3xl font-semibold">Vérification du compte</h1>
                <p className="font-normal text-md max-w-[400px] pt-2">Veuillez vérifier votre compte via l'e-mail que nous avons envoyé, puis connectez-vous à notre plateforme.</p>
                <div className="pl-10 mt-8 flex items-center gap-2">
                    <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                    <p>Cliquez sur "Vérifier".</p>
                </div>
                <div className="mt-8 flex justify-between items-center px-5">
                    <p
                        className="hover:scale-[1.02] underline text-gray-400 cursor-pointer"
                        onClick={onRetourner}
                    >
                        Retourner
                    </p>
                    <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] font-medium bg-[#12648e] text-white rounded-2xl px-5 py-2">
                        Vérifier
                    </a>
                </div>
            </div>
        </div>
    );
}





// export function FormS({ onSwitch, onRegistrationSuccess }) {
//     const [formData, setFormData] = useState({
//         Email: '',
//         'Mot de passe': '',
//         'Confirmer le mot de passe': '',
//     });

//     const [formErrors, setFormErrors] = useState({
//         Email: '',
//         'Mot de passe': '',
//         'Confirmer le mot de passe': '',
//     });

//     const [formValidity, setFormValidity] = useState({
//         Email: true,
//         'Mot de passe': true,
//         'Confirmer le mot de passe': true,
//     });

//     const [emailConflictError, setEmailConflictError] = useState('');

//     const validateEmail = (email) => {
//         const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
//         return re.test(String(email).toLowerCase());
//     };

//     const validatePassword = (password) => {
//         return password.length >= 6;
//     };

//     const validateConfirmPassword = (password, confirmPassword) => {
//         return password === confirmPassword;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         // Clear the error message when the input is valid
//         if (formErrors[name] && validateField(name, value)) {
//             setFormErrors({ ...formErrors, [name]: '' });
//         }

//         // Clear email conflict error when the user modifies the email input
//         if (name === 'Email') {
//             setEmailConflictError('');
//         }
//     };

//     const handleBlur = (e) => {
//         validateField(e.target.name, e.target.value);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             validateField(e.target.name, e.target.value);
//         }
//     };

//     const validateField = (name, value) => {
//         let isValid = true;
//         let error = '';

//         if (value) {
//             switch (name) {
//                 case 'Email':
//                     isValid = validateEmail(value);
//                     error = isValid ? '' : 'Veuillez saisir une adresse e-mail valide.';
//                     break;
//                 case 'Mot de passe':
//                     isValid = validatePassword(value);
//                     error = isValid ? '' : 'Le mot de passe doit comporter au moins 6 caractères.';
//                     break;
//                 case 'Confirmer le mot de passe':
//                     isValid = validateConfirmPassword(formData['Mot de passe'], value);
//                     error = isValid ? '' : 'Ces mots de passe ne correspondent pas. Veuillez réessayer.';
//                     break;
//                 default:
//                     break;
//             }

//             setFormErrors({ ...formErrors, [name]: error });
//             setFormValidity({ ...formValidity, [name]: isValid });
//         }
//     };

//     const validateForm = () => {
//         let isFormValid = true;

//         for (const field in formData) {
//             if (formData.hasOwnProperty(field)) {
//                 validateField(field, formData[field]);
//                 if (!formValidity[field]) {
//                     isFormValid = false;
//                 }
//             }
//         }

//         return isFormValid;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (validateForm()) {
//             const { Email, 'Mot de passe': Password } = formData;
//             const payload = { Email, Password };

//             try {
//                 const response = await fetch('http://localhost:5116/api/registration', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (response.ok) {
//                     onRegistrationSuccess();
//                     console.log('User registered successfully');
//                 } else {
//                     const errorData = await response.json().catch(() => ({ message: 'Failed to parse JSON' }));
//                     if (response.status === 409) {
//                         setEmailConflictError("L’adresse e-mail que vous avez entrée est déjà enregistrée. Veuillez utiliser une autre adresse e-mail pour vous inscrire.");
//                     } else {
//                         console.error('Failed to register user:', errorData.message);
//                     }
//                 }
//             } catch (error) {
//                 console.error('An error occurred while registering the user:', error);
//             }
//         }
//     };

//     return (
//         <div id="LgForm" className="backdrop-blur- bg-white/95 max-w-md rounded-lg bg-b text-black px-8 py-4">
//             <h1 className="text-[#12648e] text-3xl font-semibold">Créer un compte</h1>
//             <p className="font-normal text-md max-w-xl pt-1.5">Bienvenue, inscrivez-vous et soumettez votre candidature aux concours du Centre Hospitalier Universitaire de Fès.</p>
//             <form id="lgForm" className="flex flex-col mt-8 space-y-10 " onSubmit={handleSubmit}>
//                     <div>
//                         <InputField
//                             name="Email"
//                             placeholder="Entrer votre email"
//                             error={formErrors.Email}
//                             isValid={formValidity.Email}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             onKeyDown={handleKeyDown}
//                         />
//                         {emailConflictError && (
//                             <div className="pt-2">
//                                 <span className="text-red-600 text-sm">{emailConflictError}</span>
//                             </div>
//                         )}
//                     </div>
//                     <div>
//                         <InputField
//                             name="Mot de passe"
//                             placeholder="Entrer votre mot de passe"
//                             error={formErrors['Mot de passe']}
//                             isValid={formValidity['Mot de passe']}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div>
//                         <InputField
//                             name="Confirmer le mot de passe"
//                             placeholder="Confirmer votre mot de passe"
//                             error={formErrors['Confirmer le mot de passe']}
//                             isValid={formValidity['Confirmer le mot de passe']}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>

//                 <div className="flex justify-between">
//                     <p onClick={onSwitch} className="hover:scale-[1.02] mb-4 font-medium text-[#12648e] cursor-pointer py-1 underline">J'ai déjà un compte</p>
//                     <button type="submit" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] mb-4 font-medium bg-[#12648e] text-white rounded-2xl px-5 py-1">Créer</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

export function FormS({ onSwitch, onRegistrationSuccess, setIsLoading }) {
    const [formData, setFormData] = useState({
        Email: '',
        'Mot de passe': '',
        'Confirmer le mot de passe': '',
    });

    const [errors, setErrors] = useState({
        Email: '',
        'Mot de passe': '',
        'Confirmer le mot de passe': '',
    });

    const [emailConflictError, setEmailConflictError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear specific field error when the user modifies the input
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        if (name === 'Email') {
            setEmailConflictError('');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.Email) {
            newErrors.Email = "L'email est requis.";
        } else if (!validateEmail(formData.Email)) {
            newErrors.Email = "L'email n'est pas valide.";
        }

        if (!formData['Mot de passe']) {
            newErrors['Mot de passe'] = "Le mot de passe est requis.";
        } else if (formData['Mot de passe'].length < 4) {
            newErrors['Mot de passe'] = "Le mot de passe doit contenir au moins 4 caractères.";
        }

        if (!formData['Confirmer le mot de passe']) {
            newErrors['Confirmer le mot de passe'] = "La confirmation du mot de passe est requise.";
        } else if (formData['Confirmer le mot de passe'] !== formData['Mot de passe']) {
            newErrors['Confirmer le mot de passe'] = "Les mots de passe ne correspondent pas.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const { Email, 'Mot de passe': Password } = formData;
        const payload = { Email, Password };

        try {
            const response = await fetch('http://localhost:5116/api/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onRegistrationSuccess();
                console.log('User registered successfully');
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to parse JSON' }));
                if (response.status === 409) {
                    setEmailConflictError("L’adresse e-mail que vous avez entrée est déjà enregistrée. Veuillez utiliser une autre adresse e-mail pour vous inscrire.");
                } else {
                    console.error('Failed to register user:', errorData.message);
                }
            }
        } catch (error) {
            console.error('An error occurred while registering the user:', error);
        }finally {
                        setIsLoading(false);
                    }
    };

    return (
        <div id="LgForm" className="backdrop-blur- bg-white/95 max-w-md rounded-lg bg-b text-black px-8 py-4">
            <h1 className="text-[#12648e] text-3xl font-semibold">Créer un compte</h1>
            <p className="font-normal text-md max-w-xl pt-1.5">Bienvenue, inscrivez-vous et soumettez votre candidature aux concours du Centre Hospitalier Universitaire de Fès.</p>
            <form id="lgForm" className="flex flex-col mt-8 space-y-10" onSubmit={handleSubmit}>
                <div>
                    <InputField
                        name="Email"
                        placeholder="Entrer votre email"
                        onChange={handleChange}
                        value={formData.Email}
                        onInvalid={(e) => e.preventDefault()} // Prevent default browser validation message
                    />
                    {errors.Email && (
                        <div className="pt-2">
                            <span className="text-red-600 text-sm">{errors.Email}</span>
                        </div>
                    )}
                    {emailConflictError && (
                        <div className="pt-2">
                            <span className="text-red-600 text-sm">{emailConflictError}</span>
                        </div>
                    )}
                </div>
                <div>
                    <InputField
                        name="Mot de passe"
                        placeholder="Entrer votre mot de passe"
                        onChange={handleChange}
                        value={formData['Mot de passe']}
                        type="password"
                    />
                    {errors['Mot de passe'] && (
                        <div className="pt-2">
                            <span className="text-red-600 text-sm">{errors['Mot de passe']}</span>
                        </div>
                    )}
                </div>
                <div>
                    <InputField
                        name="Confirmer le mot de passe"
                        placeholder="Confirmer votre mot de passe"
                        onChange={handleChange}
                        value={formData['Confirmer le mot de passe']}
                        type="password"
                    />
                    {errors['Confirmer le mot de passe'] && (
                        <div className="pt-2">
                            <span className="text-red-600 text-sm">{errors['Confirmer le mot de passe']}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between">
                    <p onClick={onSwitch} className="hover:scale-[1.02] mb-4 font-medium text-[#12648e] cursor-pointer py-1 underline">J'ai déjà un compte</p>
                    <button type="submit" className="active:scale-[.95] active:duration-75 transition-all ease-in-out hover:scale-[1.05] mb-4 font-medium bg-[#12648e] text-white rounded-2xl px-5 py-1">Créer</button>
                </div>
            </form>
        </div>
    );
}



// export function FormS({ onSwitch, onRegistrationSuccess, setIsLoading }) {
//     const [formData, setFormData] = useState({
//         Email: '',
//         'Mot de passe': '',
//         'Confirmer le mot de passe': '',
//     });

//     const [errors, setErrors] = useState({
//         Email: '',
//         'Mot de passe': '',
//         'Confirmer le mot de passe': '',
//     });

//     const [emailConflictError, setEmailConflictError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//         if (name === 'Email') {
//             setEmailConflictError('');
//         }
//     };

//     const validateEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.Email) {
//             newErrors.Email = "L'email est requis.";
//         } else if (!validateEmail(formData.Email)) {
//             newErrors.Email = "L'email n'est pas valide.";
//         }

//         if (!formData['Mot de passe']) {
//             newErrors['Mot de passe'] = "Le mot de passe est requis.";
//         } else if (formData['Mot de passe'].length < 4) {
//             newErrors['Mot de passe'] = "Le mot de passe doit contenir au moins 4 caractères.";
//         }

//         if (!formData['Confirmer le mot de passe']) {
//             newErrors['Confirmer le mot de passe'] = "La confirmation du mot de passe est requise.";
//         } else if (formData['Confirmer le mot de passe'] !== formData['Mot de passe']) {
//             newErrors['Confirmer le mot de passe'] = "Les mots de passe ne correspondent pas.";
//         }

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         setIsLoading(true);

//         const { Email, 'Mot de passe': Password } = formData;
//         const payload = { Email, Password };

//         try {
//             const response = await fetch('http://localhost:5116/api/registration', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (response.ok) {
//                 onRegistrationSuccess();
//                 console.log('User registered successfully');
//             } else {
//                 const errorData = await response.json().catch(() => ({ message: 'Failed to parse JSON' }));
//                 if (response.status === 409) {
//                     setEmailConflictError("L’adresse e-mail que vous avez entrée est déjà enregistrée. Veuillez utiliser une autre adresse e-mail pour vous inscrire.");
//                 } else {
//                     if (errorData.errors) {
//                         setErrors((prevErrors) => ({ ...prevErrors, ...errorData.errors }));
//                     } else {
//                         console.error('Failed to register user:', errorData.message);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('An error occurred while registering the user:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

   