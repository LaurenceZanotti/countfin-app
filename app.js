import moment from './node_modules/moment/dist/moment.js';

// Account class: represents an account

class Conta {
    constructor(accountId, accountName, accountValue, accountDue, accountPayDate){
        this.accountId = accountId;
        this.accountName = accountName;
        this.accountValue = accountValue;
        this.accountDue = accountDue;
        this.accountPayDate = accountPayDate;
    }    
}

// UI Class: handle UI tasks
class UI {
    static displayAccounts(){
        const contas = Store.getAccounts();

        contas.forEach((conta) => UI.addAccountToList(conta));
    }

    static addAccountToList(conta) {
        const list = document.querySelector('#account-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="account-number-cell">${conta.accountId}</td>
            <td class="account-name-cell">${conta.accountName}</td>
            <td class="account-value-cell">${conta.accountValue}</td>
            <td class="account-due-cell">${conta.accountDue}</td>
            <td class="account-paydate-cell">${conta.accountPayDate}</td>
            <td class="account-delete-cell"><a href="#" title="Deletar"><i class="fa fa-close text-danger" id="del"></i></a></td>
            <td class="account-edit-cell"><a href="#" title="Editar"><i class="edit-button fa fa-pencil-square" id="edit"></i></a></td>
        `;

        list.appendChild(row);
    }

    static clearFields() {
        // Better solution for clearing form fields
        document.querySelector('#account-form').reset();
    }

    static deleteAccount(el) {
        if(el.classList.contains('fa-close')) {                      
            Store.removeAccount(el.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);                             
            el.parentElement.parentElement.parentElement.remove();            
        }
    }

    static  editAccount(el) {
        
        /* DOM navigation tree from el parameter using parentNode (to access its respective content)
            
            el = <i>            
            therefore:
            el.<a>.<td>.<tr>          

        */

        // el = <i> or icon tag
        const anchor = el.parentNode; // <a> or anchor tag
        // const editButtonCell = el.parentNode.parentNode; // <td> or table data cell tag
        const row = el.parentNode.parentNode.parentNode; // <tr> or table row tag
        
        if(el.classList.contains('edit-button')) {            
            // Indicate to user which row is being edited            
            row.setAttribute('class', 'border border-primary text-primary'); // Highlights row being edited
            // "Instatiates" accept button
            const acceptBtn = document.createElement('i');
            acceptBtn.setAttribute('class', 'accept-button fas fa-check-circle');
            acceptBtn.setAttribute('id', 'accept');
            anchor.insertBefore(acceptBtn, el);
            el.style.display = 'none'; 
            // Get Array of cells from the selected row
            const rowItem = row.children;
            // Iterate through the array making content editable
            for (var i = 1; i <= 4; i++){
                rowItem[i].setAttribute('contentEditable','true');
            }            
            
        }
    }

    static acceptChanges(el) {

        const anchor = el.parentNode; // <a> or anchor tag
        const row = el.parentNode.parentNode.parentNode;

        if(el.classList.contains('accept-button')) {            
            // GET ROW VALUES
            let accountId, accountName, accountValue, accountDue, accountPayDate;            
            // REMOVES UI ROW HIGHLIGHT
            row.removeAttribute('class');    
            // ITERATE THROUGH TABLE ROW DATA 
            const selectedRow = row.children;

            for (var i = 0; i <= 4; i++) {
                // Prevents user from editing the row again
                selectedRow[i].removeAttribute('contentEditable'); 
                // Get new edited content and prepare them to send to Store class
                switch (i) {
                    case 0:
                        accountId = selectedRow[i].textContent;
                        break;
                    case 1:
                        accountName = selectedRow[i].textContent;
                        break;
                    case 2:
                        accountValue = selectedRow[i].textContent * 1;
                        break;
                    case 3:
                        accountDue = selectedRow[i].textContent;
                        break;
                    case 4:
                        accountPayDate = selectedRow[i].textContent;
                        break;
                
                    default:
                        console.warn('Something went wrong in this iteration');
                        break;
                }
            }
            
            // The below part of this function shouldn't be executed if the data is written in the wrong format
            const account = new Conta(accountId, accountName, accountValue, accountDue, accountPayDate);
            
            Store.updateAccount(account);

            // Displays the default edit button and removes the "instantiated" accept button
            el.nextElementSibling.style.display = 'inline-block';            
            el.remove();
        }
    }
    
    static showAlert(message, className) {               
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        //  div.textContent(message);
        div.appendChild(document.createTextNode(message));                
        // Adds the div before the form        
        const container = document.querySelector('#add-account');
        const form = document.querySelector('#account-form');
        container.insertBefore(div, form);
        // Indicates inputs to be filled
        const inputName = document.querySelector('#account-name');        
        const inputValue = document.querySelector('#account-value');

        if (className === 'danger') {
            inputName.classList.add('border-danger');
            inputValue.classList.add('border-danger');
        }

        // Vanish after 3 seconds
        setTimeout(() => {
            div.remove();
            inputName.classList.remove('border-danger');
            inputValue.classList.remove('border-danger');
        }, 3000);
    }

    static pageNavigator(ev) {
        ev.preventDefault();
        switch(ev.target.id) {
            case 'nav-home':
                document.getElementById('home-dashboard').style.display = 'block';                    
                document.getElementById('search-account').style.display = 'none';     
                document.getElementById('add-account').style.display = 'none';           
                break;
            case 'nav-procurar':                
                document.getElementById('home-dashboard').style.display = 'none';                    
                document.getElementById('search-account').style.display = 'block';
                document.getElementById('add-account').style.display = 'none';                
                break;
            case 'nav-adicionar':
                document.getElementById('home-dashboard').style.display = 'none';                
                document.getElementById('search-account').style.display = 'none';
                document.getElementById('add-account').style.display = 'block';                
                break;
            case 'nav-sobre':
                // console.log('Sobre o app') Ainda vou inserir uma página;
                break            
            default:
                console.warn('Erro no pageSection(ev)');
                break;
        }
    }

    static searchAccount(searchValue) {
        const list = document.querySelector('#account-list').children;

        for (var i = 0; i < list.length; i++) {            
            if(list[i].innerHTML.includes(searchValue)) {
                list[i].style.display = 'table-row';                                
            } else {                
                list[i].style.display = 'none';
            }
        }
    }

    /**
     * Loads the default dashboard values. Used when DOM is loaded.
     */
    static loadDashboard() {
        // Gets the month select element and current month
        const selector = document.querySelector('select#dashboard-month-selector');        
        const month = new Date().getMonth() + 1;                

        // 
        for (let i = 0; i < selector.options.length; i++) {
            if (selector.options[i].index == month) {                       
                selector.options[i].setAttribute('selected', '');
                document.querySelector('section#home-dashboard h2 span').textContent = selector.value;
            }
        }

        UI.showMonthExpenses(month);
    }    

    static showMonthExpenses(month) {
        const header = document.querySelector('section#home-dashboard h2');
        const freeBalanceLabel = document.querySelector('span#free-balance-label');
        const expenseLabel = document.querySelector('span#expense-sum-label');
        const personalBalanceLabel = document.querySelector('span#personal-balance-label');
        const year = new Date().getFullYear();
        const balance = 7000; // A future implementation: change the month's balance

        // Retrieves the accounts data
        const account = Store.getAccounts();

        // Gets the sum of the month
        let summ = 0;        
        
        if (month == 0) { // Updates dashboard with the year statistics
            account.forEach((eachAccount) => {
                if (eachAccount.accountDue.includes(`${year}`)) {
                    summ += eachAccount.accountValue;
                }
            });

            header.style.display = 'none';
            freeBalanceLabel.parentElement.style.display = 'none';

            expenseLabel.nextElementSibling.textContent = ` em contas no ano de ${year}`;
            expenseLabel.textContent = `R$ ${summ.toFixed(2)}`;
            return;
        } else {
            account.forEach((eachAccount) => {
                if (eachAccount.accountDue.includes(`${month}/${year}`)) {
                    summ += eachAccount.accountValue;
                }                       
            });

            header.style.display = 'block';
            freeBalanceLabel.parentElement.style.display = 'block';
            expenseLabel.nextElementSibling.textContent = ' em contas';
        }
        
        
        // Styles the free balance label        
        if (balance - summ <= 0) {
            freeBalanceLabel.style.color = 'red';
            freeBalanceLabel.nextElementSibling.textContent = ' em débito...';
            
        } else {
            freeBalanceLabel.style.color = 'green';
            freeBalanceLabel.nextElementSibling.textContent = ' para gastar ou salvar';            
        }

        // Sets labels content        
        freeBalanceLabel.textContent = `R$ ${(balance - summ).toFixed(2)}`;
        expenseLabel.textContent = `R$ ${summ.toFixed(2)}`;
        personalBalanceLabel.textContent = `R$ ${balance.toFixed(2)}`;        
        
    }
}

// Store Class: Handles storage
class Store {
    static getAccounts() {
        let account;
        if (localStorage.getItem('contas') === null || localStorage.getItem('contas') === '') {
            account = [];
        } else {
            account = JSON.parse(localStorage.getItem('contas'));
        }

        return account;
    }

    static addAccounts(conta) {
        const contas = Store.getAccounts();
        contas.push(conta);
        localStorage.setItem('contas', JSON.stringify(contas));
    }

    static removeAccount(nomeConta) {
        const accounts = Store.getAccounts();

        accounts.forEach((conta, index) => {
            if (conta.accountName === nomeConta)  {
                accounts.splice(index, 1);
            }
        });

        localStorage.setItem('contas', JSON.stringify(accounts));
    }

    static updateAccount(rowId) {
        const accounts = Store.getAccounts();    

        accounts.forEach((conta) => {
            if (conta.accountId == rowId.accountId)  {
                conta.accountName = rowId.accountName;     
                conta.accountValue = rowId.accountValue;
                conta.accountDue = rowId.accountDue;
                conta.accountPayDate = rowId.accountPayDate;
            }
        });

        localStorage.setItem('contas', JSON.stringify(accounts));
    }
}

class DataValidation {
    static getDate(date) {
        if (date == '') {
            return '';
        } else {
            return moment(date).format('DD/MM/YYYY');
        }
    }
}

// Event: On page loaded, display account
document.addEventListener('DOMContentLoaded', 
UI.displayAccounts(),
UI.loadDashboard());

// Event: Add an account
document.querySelector('#account-form').addEventListener('submit', function(e)
{
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    let accountId = document.querySelector('#account-list').lastElementChild;        
    if(accountId === null) {
        accountId = 1;
    } else {
        accountId = accountId.rowIndex + 1;
    }    
    const accountName = document.querySelector('#account-name').value;
    const accountValue = document.querySelector('#account-value').value * 1;    
    const accountDue = DataValidation.getDate(document.querySelector('#account-due').value);
    const accountPayDate = DataValidation.getDate(document.querySelector('#account-payment-date').value);


    // Validation
    if (accountName === '' || accountValue === '') {
        UI.showAlert('Há campos que precisam ser preenchidos', 'danger')
    } else {
        // Instantiate account
        const account = new Conta(accountId, accountName, accountValue, accountDue, accountPayDate);

        // Add Book to UI
        UI.addAccountToList(account);
        UI.showAlert('Conta adicionada', 'primary');

        // Add book to store
        Store.addAccounts(account);

        // Updates dashboard        
        UI.showMonthExpenses(new Date().getMonth() + 1)

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove or edit an account
document.querySelector('#account-list').addEventListener('click', function(e){
    e.preventDefault();
    UI.deleteAccount(e.target);
    UI.editAccount(e.target);
    UI.acceptChanges(e.target);    
    UI.showMonthExpenses(new Date().getMonth() + 1)
});

// Event: Navbar navigation
document.querySelector(".navbar-nav").addEventListener('click', (e) => UI.pageNavigator(e));

// Event: Search input update
document.querySelector('input[type=search]').addEventListener('keyup', function(e){    
    e.preventDefault();
    UI.searchAccount(e.target.value);
});

// Event: Month select input
document.querySelector('button#month-select-button').addEventListener('click', () => {
    const month = document.querySelector('select#dashboard-month-selector').selectedIndex;
    UI.showMonthExpenses(month)
})
