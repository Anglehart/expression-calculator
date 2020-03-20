function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
  let stack = []; //стек
  let exit = []; //массив выхода
  if (expr.split('(').length != expr.split(')').length){throw "ExpressionError: Brackets must be paired"} //проверка на закрытые скобки
  expr = expr.replace(/ {1,}/g,' '); //убираем двойные пробелы
  let arr = expr.trim().split(' '); //убираем пробелы в начале и конце

  if (expr.includes(' ') == false) { //исключение для строк без проблов
    arr = expr.split('');
  }

  for (let i = 0; i < arr.length; i++){
    if (Number.isInteger(Number(arr[i]))) { //если элемент число
      exit.push(arr[i]);                    //сразу добавляем в выход
    } else if (arr[i] == '+' || arr[i] == '-') { //если плюс или минус - проверяем крайнее значение стека
        if (stack[stack.length - 1] == '-' || stack[stack.length - 1] == '+'){ //если в стеке + или -, то выталкиваем его выход
          exit.push(stack[stack.length - 1]);
          stack.pop();
          stack.push(arr[i]);
        } else if(stack[stack.length - 1] == '*' || stack[stack.length - 1] == '/') { //если в стеке * или /, то выталкиваем весь стек до скобки
          while(stack[stack.length - 1] != '(' && stack.length > 0){
            exit.push(stack[stack.length - 1]);
            stack.pop();
          };
          stack.push(arr[i]);
        } else {
          stack.push(arr[i]);
        }
    } else if (arr[i] == '*' || arr[i] == '/') { //если * или /, то замением только * или /
        if (stack[stack.length - 1] == '*' || stack[stack.length - 1] == '/'){
          exit.push(stack[stack.length - 1]);
          stack.pop();
          stack.push(arr[i]);
        } else {
          stack.push(arr[i]);
        }
    } else if (arr[i] == '(') { //открывающую скобку просто добавляем в стек
      stack.push(arr[i]);
    } else if (arr[i] == ')') { //закрывающая выталкивает в стек все до открывающей, а ее удаляет
        while(stack[stack.length - 1] != '(') {
          exit.push(stack[stack.length - 1]);
          stack.pop();
        };
          stack.pop();
    }
  }

  let polandArr = exit.concat(stack.reverse()); //обратная польская запись
  let summ = [];
  let last = 0;
  for (let k = 0; k < polandArr.length; k++){ //использовать eval нельзя, пожтому тупо перебираем все варианты
    if (Number.isInteger(Number(polandArr[k]))) {
      summ.push(polandArr[k]);
    } else if (polandArr[k] == '+'){
        last = summ.pop();
        summ.splice(summ.length-1, 1, Number(summ[summ.length-1]) + Number(last)); //здесь и далее убираем последний элемент, а предпоследний замением на результат операции
    } else if (polandArr[k] == '-'){
        last = summ.pop();
        summ.splice(summ.length-1, 1, Number(summ[summ.length-1]) - Number(last));
    } else if (polandArr[k] == '*'){
        last = summ.pop();
        summ.splice(summ.length-1, 1, Number(summ[summ.length-1]) * Number(last));
    } else if (polandArr[k] == '/'){
        last = summ.pop();
        if (last != '0') { //проверка на деление на ноль
          summ.splice(summ.length-1, 1, Number(summ[summ.length-1]) / Number(last));
        } else {
          throw 'TypeError: Division by zero.';
        }
    }
  }
  return +summ[0].toFixed(4); //округляем до 4 знака
}

module.exports = {
    expressionCalculator
}
