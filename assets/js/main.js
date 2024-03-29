;(() => {
    document.addEventListener('DOMContentLoaded', () => {
        for (const parent of ['#intro-card', '#side-card']) {
            const avatarImg = document.querySelector(`${parent} .avatar`)
            const avatarMaskDiv = document.querySelector(
                `${parent} .avatar-mask`
            )

            if (avatarImg.complete) {
                avatarMaskDiv.setAttribute('status', 'loaded')
            } else {
                avatarImg.onload = () => {
                    avatarMaskDiv.setAttribute('status', 'loaded')
                }
            }
        }

        const moreBtn = document.querySelector('#link button')
        const backBtn = document.querySelector('#more ul button')
        const introDiv = document.querySelector('#intro')
        const moreDiv = document.querySelector('#more')

        function toggleMore() {
            if (introDiv.classList.contains('fade-out')) {
                moreDiv.classList.remove('fade-in')
                moreDiv.classList.add('fade-out')
                introDiv.classList.remove('fade-out')
                introDiv.classList.add('fade-in')
            } else {
                introDiv.classList.remove('fade-in')
                introDiv.classList.add('fade-out')
                moreDiv.classList.remove('fade-out')
                moreDiv.classList.add('fade-in')
            }
        }

        moreBtn.addEventListener('click', toggleMore)
        backBtn.addEventListener('click', toggleMore)
    })
})()
