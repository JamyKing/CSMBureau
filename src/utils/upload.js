import axios from 'axios'

// 上传图片
export function upload(file) {
  const formData = new FormData()
  formData.append('file', file)
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/common/upload',
      method: 'POST',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
    }).then((res) => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
