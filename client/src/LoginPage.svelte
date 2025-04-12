<div class="max-w-screen-xl mx-auto p-24">
    <main class="mx-auto flex">
        <section class="h-[700px] bg-[#452C4F] p-10 w-3/6 rounded-tl-lg rounded-bl-lg">
            <div class="mb-16 pl-24">
                <h1 class="text-2xl font-bold mb-4">PandaScrumPoker.</h1>
                <p class="">The Ultimate Online Estimation Tool</p>
            </div>
            <img class="m-auto" src="/no-data-panda.svg" alt="">
        </section>
        <section class="h-[700px] bg-white w-3/6 p-24 rounded-tr-lg rounded-br-lg">
            <div class="mb-10">
                <h1 class="text-2xl text-slate-800 font-bold mb-2">Log in to PandaScrumPoker.</h1>
                <p class="text-sm text-slate-500">Welcome back! Login as moderator to create the session room</p>
            </div>
            <div class="flex w-full flex-col">
                <form method="POST" action="/login" class="fieldset">
                    <legend class="fieldset-legend text-slate-600 mb-1">Enter your name:</legend>
                    <input name="name" type="text" class="input w-full bg-white border-[#e5e5e5] text-black mb-2" placeholder="Black Panda" />
                    <button type="submit" class="btn btn-primary w-full text-white">Join</button>
                </form>
                <div class="divider text-black text-sm">OR</div>
                <div>
                    <a role="button" class="btn bg-white text-black border-[#e5e5e5] w-full mb-2" href="/auth/jira">
                        <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.808 7.552L8.69.667 8 0 2.642 5.183l-2.45 2.37A.623.623 0 000 8c0 .168.069.329.192.448l4.895 4.735L8 16l5.358-5.183.083-.08 2.367-2.29A.623.623 0 0016 8a.623.623 0 00-.192-.448zM8 10.365L5.554 8 8 5.635 10.446 8 8 10.365z" fill="#2684FF"></path><path d="M8 5.634A3.918 3.918 0 016.794 2.83 3.917 3.917 0 017.983.018L2.63 5.193 5.543 8.01 8 5.634z" fill="url(#paint0_linear)"></path><path d="M10.452 7.994L8 10.365c.383.37.686.81.893 1.293a3.87 3.87 0 010 3.05c-.207.483-.51.922-.893 1.292l5.365-5.189-2.913-2.817z" fill="url(#paint1_linear)"></path><defs><linearGradient id="paint0_linear" x1="7.563" y1="3.241" x2="4.262" y2="6.654" gradientUnits="userSpaceOnUse"><stop offset=".18" stop-color="#0052CC"></stop><stop offset="1" stop-color="#2684FF"></stop></linearGradient><linearGradient id="paint1_linear" x1="216.055" y1="490.616" x2="331.647" y2="413.158" gradientUnits="userSpaceOnUse"><stop offset=".18" stop-color="#0052CC"></stop><stop offset="1" stop-color="#2684FF"></stop></linearGradient></defs></g></svg>
                        Login with Jira
                    </a>
                    <p class="text-sm text-slate-500 mb-4 text-center">if you're going to use Jira integration.</p>
                    <div class="divider text-black text-sm">OR</div>
                    <a role="button" class="btn bg-white text-black border-[#e5e5e5] w-full" href="/auth/google">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </a>
                </div>
              </div>
            <div class="mb-2">
                
            </div>
           
        </section>
    </main>
</div>