
// select Elements
const balanceEl = document.querySelector('.balance .value')

const incomeTotalEl = document.querySelector('.income-total')

// const outcomeTotalEl = document.querySelector('.expense-total')
const outcomeTotalEl = document.querySelector('.outcome-total')
const incomeEl = document.querySelector('#income')

const expenseEl = document.querySelector('#expense')

const allEl = document.querySelector('#all')

const incomeList = document.querySelector('#income .list')

const expenseList = document.querySelector('#expense .list')

const allList = document.querySelector('#all .list')

// select BTN
const expenseBtn = document.querySelector('.tab1');
const incomeBtn  = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

//   input BTS
const addIncome = document.querySelector("#add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");
const addExpense = document.querySelector("#add-expense");
const expenseTitle = document.querySelector("#expense-title-input");
const expenseAmount = document.querySelector("#expense-amount-input");


// Variables
let ENTRY_LIST ;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete",EDIT = "edit";



// save data

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list"))||[];
updateUI();
incomeList.addEventListener("click", deleteorEdit);
expenseList.addEventListener("click", deleteorEdit);
allList.addEventListener("click", deleteorEdit);




// event Listeners


expenseBtn.addEventListener('click',function(){
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
    show(expenseEl);
    hide([incomeEl, allEl]);
});
incomeBtn.addEventListener('click',function(){
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
    show(incomeEl);
    hide([expenseEl, allEl]);
});
allBtn.addEventListener('click',function(){
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
    show(allEl);
    hide([incomeEl, expenseEl]);
});


// Helpers

function deleteorEdit(event){
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;
    if(targetBtn.id == DELETE ){
    deleteEntry(entry);
    }
    else if(targetBtn.id == EDIT){
        editEntry(entry);
    }
    }
    function deleteEntry(entry){
         ENTRY_LIST.splice(entry.id, 1);
         updateUI();
    }
    function editEntry(entry){
    let ENTRY = ENTRY_LIST[entry.id];
    if(ENTRY.type =="income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type =="expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }
     
    }
function show(element){
    element.classList.remove('hide');
}
function hide(elements){
    elements.forEach(element=>{
        element.classList.add('hide'); 
    });
}
function active(element){
    element.classList.add('active');
}
function inactive(elements){
    elements.forEach((item)=>{
        item.classList.remove('active');
    });
}
function clearInput(inputsArray){
    inputsArray.forEach(input=>{
        input.value = '';
    });
}
function clearElement(elements){
    elements.forEach(element=>{
        element.innerHTML ="";
    })
}
addIncome.addEventListener('click',function(){
if( !incomeTitle.value || !incomeAmount.value  )  return;
let income = {
    type: "income",
    title : incomeTitle.value,
    amount : parseFloat(incomeAmount.value),
}
ENTRY_LIST.push(income);
updateUI();
clearInput( [incomeTitle, incomeAmount] );
});

addExpense.addEventListener('click',function(){
   
    if( !expenseTitle || !expenseAmount  )  return;
    let expense = {
        type: "expense",
        title : expenseTitle.value,
        amount : parseFloat(expenseAmount.value),
    }
    ENTRY_LIST.push(expense);
    updateUI();
    clearInput( [expenseTitle, expenseAmount] );
    });


function updateUI(){
     income = calculateTotal("income",ENTRY_LIST)
     outcome = calculateTotal("expense",ENTRY_LIST)
     balance = Math.abs(calculateBalance(income, outcome));
     clearElement([expenseList, incomeList , allList])
       
        // sign of balance
    let sign = (income >= outcome) ?"$":"-$";
    ENTRY_LIST.forEach((entry , index) =>{
        if(entry.type === "expense"){
            console.log("expense");
            showEntry(expenseList,entry.type ,entry.title,entry.amount,index)
        }else if(entry.type === "income"){
            console.log("income");
            showEntry(incomeList,entry.type ,entry.title,entry.amount,index)
        }
        showEntry(allList,entry.type ,entry.title,entry.amount,index)
    })
    //  UPDATE UI

     balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`
    
localStorage.setItem("entry_list",JSON.stringify(ENTRY_LIST));

}

function showEntry(list ,type,title,amount ,id ){
  let entry = "";
    if(type == "expense"){
     entry += `<li id = "${id}" class="${type}">
    <div  style=color:red  class ="entry">${title}:$${amount}</div>
    <div id="edit"><i   class="fa fa-pencil-square" aria-hidden="true"></i></div>
    <div id="delete"><i  class="fa fa-trash-o" aria-hidden="true"></i</div>
              </li>`; 
   }
   else if(type == "income"){
     entry += `<li id = "${id}" class="${type}">
    <div  class ="entry">${title}:$${amount}</div>
    <div id="edit"><i class="fa fa-pencil-square" aria-hidden="true"></i></div>
    <div id="delete"><i class="fa fa-trash-o" aria-hidden="true"></i</div>
              </li>`; 
   }
  const position = "afterbegin";
// console.log(entry);
list.insertAdjacentHTML(position ,entry);
// console.log(list);

}

function calculateTotal(type,list){
    let sum = 0;
    list.forEach(entry=>{
        if(entry.type == type){
            sum += entry.amount;
        }
    })
    return sum;
}

function calculateBalance(income,outcome){
    return income - outcome;
}