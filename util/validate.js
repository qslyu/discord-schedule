export function validateEventName(value) {
  let error
  
  if(!value) {
    error = "Required"
  } else if(value.length >= 50) {
    error = "Too long"
  }
  return error
}

export function validateDescription(value) {
  let error
  
  if(value) if(value.length >= 500) {
    error = "Too long"
  }
  return error
}

export function validateDatetime(value) {
  let error
  
  if(new Date(value) == "Invalid Date") {
    error = "Invalid date"
  }

  return error
}

export function validateEvalution(value) {
  if(evaluation == 'excellent' || evaluation == 'average' || evaluation == 'bad') {
    return
  }
  return 'Invalid option'
}

export function validateSchedule(values) {
  let error
  
  if(!values.length) {
    error = "Required"
  } else if(values.length >= 500) {
    error = "Too long"
  } else {
    values.map(value => {
      const d = new Date(value)
      
      if(d == "Invalid Date") {
        error = "Invalid date"
      } else if(Date.now() > d.getTime()) {
        error = "Past"
      }
    })
  }
  return error
}