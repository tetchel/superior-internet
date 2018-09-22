import InferData from './infer-data'

const printToScreen = (text) => {
  const el = document.createElement('pre')
  el.textContent = text
  document.body.append(el)
}

printToScreen(JSON.stringify(InferData(), null, 2))
