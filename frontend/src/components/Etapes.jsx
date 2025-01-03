export  function EtapesLin() {
    return(
        <div id="Etapes" className="flex  flex-col bg-white/90 p-4 rounded-md">
            <h1 className="text-[#12648e] text-4xl font-semibold">Etapes</h1>
            <p className="font-normal text-md max-w-[400px] pt-1">Connectez-vous, postulez, et restez informé du statut de votre candidature. Votre avenir commence ici.</p>
            <div className="pl-10">
            <div className="mt-10 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Postuler la candidature</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Voir le statut du candidature</p>
            </div>
            </div>
        </div>
    )
  }

  export  function EtapesSup() {
    return(
        <div id="Etapes" className="flex  flex-col bg-white/90 p-4 rounded-md">
            <h1 className="text-[#12648e] text-4xl font-semibold">Etapes</h1>
            <p className="font-normal text-md max-w-[400px] pt-1">Votre prochaine opportunité est à portée de clic. Créez votre compte et vérifiez-le par e-mail pour commencer.</p>
            <div className="pl-10">
            <div className="mt-10 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Creer un compte</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Verifier le compte par e-mail</p>
            </div>
            </div>
        </div>
    )
  }

  export  function NotExist() {
    return(
        <div id="Etapes" className="flex  flex-col bg-white/90 p-4 rounded-md">
            <h1 className="text-red-600 text-4xl font-semibold">Désolé</h1>
            <p className="font-normal text-md max-w-[400px] pt-1  "> il n'y a actuellement aucune candidature disponible pour la profession que vous avez choisie. </p>
            <div className="pl-10">
                <div className="mt-10 flex items-center gap-2">
                    <div className="w-[6px] h-[45px] bg-red-600"></div>
                    <p>Veuillez vérifier à nouveau la profession selectionne</p>
                </div>
            </div>
        </div>
    )
  }

  export  function CandidatureRefuser() {
    return(
        <div id="Etapes" className="flex  flex-col bg-white/90 px-4 py-6 rounded-md max-w-lg">
            <h1 className="text-[#12648e] text-4xl font-semibold">Désolé !</h1>
            <p className="font-normal   pt-1  ">Merci de votre intérêt pour le CHU Hassan II. Malheureusement,<span className="text-[#12648e]"> votre candidature n'a pas été retenue cette fois. </span></p>
            <div className="pl-10">
                <div className="mt-10 flex items-center gap-2">
                    <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                    <p>Nous vous encourageons à postuler à nouveau à l'avenir.</p>
                </div>
            </div>
        </div>
    )
  }

  export  function CandidatureAccepte() {
    return(
        <div id="Etapes" className="flex  flex-col bg-white/90 px-4 py-6 rounded-md max-w-lg">
            <h1 className="text-[#12648e] text-4xl font-semibold">Félicitations !</h1>
            <p className="font-normal   pt-1  ">Votre <span className="text-[#12648e]">candidature a été acceptée </span> et vous avez été sélectionné pour passer un concours présentiel.</p>
            <div className="pl-10">
                <div className="mt-10 flex items-center gap-2">
                    <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                    <p>Veuillez vérifier notre page pour plus de détails sur la date et le lieu du concours.</p>
                </div>
            </div>
        </div>
    )
  }

  export function DomaineSp() {
    return (
        <div id="Etapes" className="flex-col bg-white/90 p-4 rounded-md">
            <h1 className="text-[#12648e] text-4xl font-semibold">Bienvenue</h1>
            <div className="pl-10">
            <div className="mt-10 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Determiner votre domaine & profession</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>cliquer sur continue</p>
            </div>
            </div>
        </div>
    );
  }

  export function Observation() {
    return (
        <div id="Etapes" className="  bg-white/90  p-4 rounded-md ">
            <h1 className="text-[#12648e] text-3xl font-semibold">Observation</h1>
            <p className="font-normal text-md max-w-md custom:max-w-4xl pt-1">Le statut votre candidature sera affiché sur cette interface immédiatement après son annonce sur notre page.</p>
            <div className="pl-10">
            <div className="mt-5 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Postuler votre condidature</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
                <div className="w-[6px] h-[45px] bg-[#12648e]"></div>
                <p>Rester informé au statut</p>
            </div>
            </div>
        </div>
    );
  }

