<div class="max-w-screen-xl mx-auto p-24">
    <main class="mx-auto flex">
        <section class="h-[700px] bg-white pl-20 pt-24 w-3/6 rounded-tl-lg rounded-bl-lg">
            <img class="m-auto" src="/app/login-face.webp" alt="">
        </section>
        <section class="h-[700px] bg-white w-3/6 px-20 py-36 rounded-tr-lg rounded-br-lg">
            <div class="mb-10">
                <h1 class="text-3xl text-slate-800 font-bold mb-2">Welcome to Scrumspoker.</h1>
                <p class="text-md text-slate-500">Feel free to join a session via <b>Google</b>,<br/> with your <b>Name</b> or completely <b>Incognito</b>.</p>
            </div>
            <div class="flex w-full flex-col">
                <form method="POST" action="/login" class="fieldset">
                    <legend class="fieldset-legend text-slate-600 mb-2 font-semibold">Enter your name:</legend>
                    <input name="name" type="text" class="input w-full bg-white border-[#e5e5e5] text-black mb-4" placeholder="Black Panda" />
                    <button type="submit" class="btn btn-primary w-full">Join</button>
                </form>
                <div class="divider text-black text-md">or</div>
                <div>
                  <a role="button" class="btn btn-secondary w-full" href="/auth/google">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </a>
                </div>
              </div>
        </section>
    </main>
</div>