const btn_action = {
    input: "",
    btn_action(event) {
        btn_action.input = event.target
  
      if (btn_action.input.innerHTML == 'ESCONDER') {
        btn_action.input.innerHTML = 'MOSTRAR'
  
        const parent = btn_action.input.parentElement.parentElement.querySelector('.toggle-content')
        parent.classList.add('hide')
      } else {
        btn_action.input.innerHTML = 'ESCONDER'
  
        const parent = btn_action.input.parentElement.parentElement.querySelector('.toggle-content')
        parent.classList.remove('hide')
      }
    }
  }