const url = window.location.href

const quizBox = document.getElementById('quiz-box')
const scoreBox = document.getElementById('score-box')
const resultBox = document.getElementById('result-box')
const timerBox = document.getElementById('timer-box')
const savebtn = document.getElementById('save-btn')

const activateTimer = (time) =>{
    console.log(time)

    if (time.toString().length < 2) {
        timerBox.innerHTML = `<b>0${time}:00</b>`
    }
    else {
        timerBox.innerHTML = `<b>${time}:00</b>`
    }

    let minutes = time - 1
    let seconds = 60
    let displaySeconds
    let displayMinutes

     const timer = setInterval(()=>{
        seconds --
        if (seconds < 0) {
            seconds = 59
            minutes --
        }
        if (minutes.toString().length < 2){
            displayMinutes = '0' +minutes
        }
        else {
            displayMinutes = minutes
        }
        if (seconds.toString().length < 2){
            displaySeconds = '0'+ seconds
        }

        else {
            displaySeconds = seconds
        }
        if (minutes === 0 && seconds === 0){
            timerBox.innerHTML = "<b>00:00</b>"
            setTimeout(()=>{
                clearInterval(timer)
                alert('Time Over')
                sendData()
            }, 500)
        }
        timerBox.innerHTML = `<b>${displayMinutes}:${displaySeconds}</b>`
    },1000)
}

$.ajax({
    type : 'Get',
    url: `${url}data`,
    success : function(response){
        // console.log(response)
        const data = response.data
        data.forEach(el =>{
            for (const [question, answers] of Object.entries(el)){
                quizBox.innerHTML += ` 
                    <hr>
                    <div class="mb-3">
                        <b>${question}</b>        
                    </div>
                `
                answers.forEach(answers =>{
                    quizBox.innerHTML += `
                        <div>
                            <input type="radio" class="ans" id="${question}-${answers}" name="${question}" value="${answers}">
                            <label for="${question}"> ${answers}</label>
                        </div>
                    `
                })
            }
        });
        activateTimer(response.time)
    },
    error : function(error){
        console.log(error)
    }
})

const quizForm = document.getElementById('quiz-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const sendData = () => {
    const elements = [...document.getElementsByClassName('ans')]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value
    elements.forEach(el=>{
        if (el.checked){
            data[el.name] = el.value
        }
        else {
            if (!data[el.name]){
                data[el.name] = null
            }
        }
    })
    $.ajax({
        type: 'POST',
        url: `${url}save/`,
        data: data,
        success: function (response){
            // console.log(response)
            const results = response.results
            console.log(results)
            quizForm.classList.add('not-visible')
            timerBox
            scoreBox.innerHTML = `<h6 >${response.passed ? 'Congratulations! ': 'Ups...:( '} Your results is ${response.score.toFixed(2)}%</h6>`

            results.forEach(res=>{
                const resDiv = document.createElement("div")
                for (const [question,resp] of Object.entries(res)){

                    resDiv.innerHTML += question
                    const cls = ['container', 'p-2', 'text-light', 'h5']
                    resDiv.classList.add(...cls)

                    if (resp == 'not answered'){
                        resDiv.innerHTML += '-not answered'
                        resDiv.classList.add('bg-danger')
                    }
                    else {
                        const answer = resp['answered']
                        const correct = resp['correct_answer']

                        if (answer == correct){
                            resDiv.classList.add('bg-success')
                            resDiv.innerHTML += ` answer: ${answer}`
                        }
                        else {
                            resDiv.classList.add('bg-danger')
                            resDiv.innerHTML += `| correct answer: ${correct}`
                            resDiv.innerHTML += `| answered: ${answer}`
                        }
                    }
                }
                //const body = document.getElementsByTagName('BODY')[0]
                resultBox.append(resDiv)

            })

        },
        error: function(error){
            console.log(error)
        }
    })

}

quizForm.addEventListener('submit', e=>{
    e.preventDefault()
    activateTimer()
    sendData()
})


