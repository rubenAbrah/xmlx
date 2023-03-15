
import reader from 'xlsx';

const file = reader.readFile('./test.xlsx')

const sheets = file.SheetNames[0]
const temp = reader.utils.sheet_to_json(file.Sheets[sheets])


let full_res = {}
let time
for (let el of temp) {
    // если поле времени пустое то берется глобальное время если нет то обнавляем старый
    if (Number(el['__EMPTY'])) {
        time = (Number(el['__EMPTY']) * 24).toFixed(2).replace('.', ':')
    }
    //----------------------------------------------//
    for (let n in el) {
        if (n != '__EMPTY') {
            if (!full_res[n]) {
                full_res[n] = {}
            }
            el[n] = el[n].replace(/\s+/g, ' ')
            el[n] = replaceText(el[n], '₽', 'Платные занятия')
            el[n] = replaceText(el[n], '+', 'По предварительной записи (отделе продаж)')
            el[n] = replaceText(el[n], '*', 'По предварительной записи (журнале на реценции)')

            addSpace(full_res, n, time, el[n])
        }
    }
}
function replaceText(el, simbol, text) {
    if (el.includes(simbol)) {
        el = el.replace(simbol, '').trim()
        el += " - " + text
    }
    return el
}
function addSpace(el, subel, subsubel, value) {
    if (el[subel][subsubel]) {
        let newSubsubel = subsubel + ' '
        if (el[subel][newSubsubel]) {
            return addSpace(el, subel, newSubsubel, value)
        } else {
            return el[subel][newSubsubel] = value
        }

    } else {
        return el[subel][subsubel] = value
    }

}

console.log(full_res)
