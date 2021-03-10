export function validateEventName(value) {
  let error
  
  if(!value) {
    error = "入力してください"
  } else if(value.length >= 50) {
    error = "長すぎます"
  }
  return error
}

export function validateDescription(value) {
  let error
  
  if(value) if(value.length >= 500) {
    error = "長すぎます"
  }
  return error
}

export function validateSchedule(values) {
  let error
  
  if(!values.length) {
    error = "入力してください"
  } else if(values.length >= 500) {
    error = "日程が多すぎます"
  } else {
    values.map(value => {
      const d = new Date(value)
      
      if(d == "Invalid Date") {
        error = "無効な日付です"
      } else if(Date.now() > d.getTime()) {
        error = "過去の日付は設定できません"
      }
    })
  }
  return error
}