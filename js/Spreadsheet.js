// declared var for global access of rows and columns
var Rowsonload = 5;
var Colsonload = 5;
var maxcolumns = 27;

// creation of observer to listen to every cell
const obs = new rxjs.Subject();
// onload of the screen load the table using below function 
window.onload = function load() {
    let SS = document.getElementById("SS");
    let table = document.createElement("table");
    table.setAttribute("id", "table");
    for (let i = 0; i < Rowsonload; i++) {
        let tr = this.document.createElement("tr");
        tr.setAttribute("id", i);
        for (let j = 0; j < Colsonload; j++) {
            let td = this.document.createElement("td");
            // sets attr id for initially loaded cells
            if (i != 0)
                td.setAttribute("id", String.fromCharCode(j + 64) + i);
            else
                td.setAttribute("id", String.fromCharCode(j + 64));
            let value;
            if (i == 0 && j > 0) {
                value = this.document.createTextNode(String.fromCharCode(j + 64));
                // listens for highlight event
                td.addEventListener("click", function() {
                    SelectedCol(td);
                },false);
                td.appendChild(value);
            } else if (j == 0 && i > 0) {
                value = this.document.createTextNode(i);
                // listens for highlight event
                td.addEventListener("click", function() {
                    select_Row(tr);
                }, false);
                td.appendChild(value);
            } else if (j == 0 && i == 0) {
                td.setAttribute("contenteditable", "false")
            } else {
                // defines whether the cell is editable or not
                td.setAttribute("contenteditable", "true")
                    // listener to listen to events
                listener(td);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    SS.appendChild(table);
}
// subscribes to the methods of addRow,delrow, addcol, delcol
const addRow = rxjs.fromEvent(document.getElementById("addRow"), 'click');
addRow.subscribe(e => addRowMethod());

const addCol = rxjs.fromEvent(document.getElementById("addCol"), 'click');
addCol.subscribe(e => addColMethod());

const delCol = rxjs.fromEvent(document.getElementById("delCol"), 'click');
delCol.subscribe(e => delColMethod());

const delRow = rxjs.fromEvent(document.getElementById("delRow"), 'click');
delRow.subscribe(e => delRowMethod());

// create a observable for row
const Addrowobs = new rxjs.Subject();
// method to add new row
const addRowMethod = () => 
{
    if (Rowselected.size > 1) {
        alert("select any row for a row to be added next to it")
    } else if (Rowselected.size == 1) {
        let iterator = Rowselected.values();
        let row = iterator.next().value;
        let index = row.rowIndex;
        let tr = document.createElement("tr");
        // emits the inserted row
        Addrowobs.next(index);
        tr.setAttribute("id", index + 1);
        for (let j = 0; j < Colsonload; j++) {
            let td = document.createElement("td");
            if (j == 0) {
                value = this.document.createTextNode(index + 1);
                td.addEventListener("click", function() {
                    select_Row(tr);
                }, false);
                td.appendChild(value);
                td.setAttribute("contenteditable", "false");
            } else {
                td.setAttribute("contenteditable", "true");
                listener(td);
            }
            tr.appendChild(td);
        }
        row.insertAdjacentElement("afterend", tr);
        Rowsonload = Rowsonload + 1;
        reArrangeRowNumbers();
    } else {
        alert("Please select a row");
    }
}
// method to rearrange the cells in the table
const reArrangeRowNumbers = () =>
 {
    let table = document.getElementById("table");
    for (let i = 0; i < Rowsonload; i++) {
        let row = table.rows[i];
        if (i > 0) {
            for (let j = 0; j < Colsonload; j++) {
                let cell = row.cells[j];
                if (j == 0) {
                    let y = cell.childNodes[0];
                    cell.removeChild(y);
                    value = this.document.createTextNode(i);
                    cell.appendChild(value);
                } else {
                    cell.setAttribute("id", String.fromCharCode(j + 64) + i);
                    if (select_Col.has(String.fromCharCode(j + 64))) {
                        cell.classList.add("highlight");
                    }
                }
            }
        } else {
            for (let j = 1; j < Colsonload; j++) {
                let cell = row.cells[j];
                let y = cell.childNodes[0];
                cell.removeChild(y);
                value = this.document.createTextNode(String.fromCharCode(j + 64));
                cell.setAttribute("id", String.fromCharCode(j + 64));
                cell.appendChild(value);
                if (select_Col.has(String.fromCharCode(j + 64))) {
                    cell.classList.add("highlight");
                }
            }
        }
    }
}
// method to add column 
const addColMethod = () => {
    if (select_Col.size > 1) {
        alert("Please select only one Column");
    } else if (select_Col.size == 1) {

        if (maxcolumns <= Colsonload) {
            alert("No more columns can be added");
            return;
        }
        let iterator = select_Col.values();
        let itr = iterator.next().value;

        let tdtop = document.createElement("td");
        tdtop.addEventListener("click", function() {
            SelectedCol(tdtop);
        }, false);
        value = this.document.createTextNode("");
        tdtop.appendChild(value);
        let coltop = document.getElementById(itr);
        coltop.insertAdjacentElement("afterend", tdtop);

        for (let i = 1; i < Rowsonload; i++) {
            let td = document.createElement("td");
            td.setAttribute("contenteditable", "true");
            listener(td);
            let col = document.getElementById(itr + i);
            // method which inserts after an ele
            col.insertAdjacentElement("afterend", td);
        }
        Colsonload++;
        reArrangeRowNumbers();
    } else {
        alert("Please select a Column");
    }
}
// delrowobs to listen to delete event within formula range
const delRowObs = new rxjs.Subject();
// method to delete a row
const delRowMethod = () => {
    if (Rowselected.size == 1) 
    {
        if (Rowsonload == 2) 
        {
            alert("No more rows can be deleted");
            return;
        }
        let ir = Rowselected.values();
        let itr = ir.next().value;
        let ind = itr.rowIndex;
        Rowselected.delete(itr);
        itr.parentElement.removeChild(itr);
        Rowsonload--;
        reArrangeRowNumbers();
        delRowObs.next(ind);
    }
     else 
     {
        alert("Please select a row to delete")
    }
}
// method to del col
const delColMethod = () =>
 {
    if (select_Col.size == 1) {
        if (Colsonload == 2) {
            alert("No more columns can be deleted");
            return;
        }
        let iterator = select_Col.values();
        let itr = iterator.next().value;
        select_Col.delete(itr);
        let topEle = document.getElementById(itr);
        topEle.parentElement.removeChild(topEle);

        for (let i = 1; i < Rowsonload; i++) {
            let element = document.getElementById(itr + i);
            element.parentElement.removeChild(element);
        }
        Colsonload--;
        // rearranges the attrs
        reArrangeRowNumbers();
    } else {
        alert("Please select only one column")
    }
}

// maintains the list of selectedrows
const Rowselected = new Set();
// method to highlight the selectedrows
const select_Row = (y) => {
    if (y.classList.contains("highlight")) {
        y.classList.remove("highlight");
        Rowselected.delete(y);
    } else {
        y.classList.add("highlight");
        Rowselected.add(y);
    }
}
// maintains the list of selected cols
const select_Col = new Set();
// method to highlight selected cols
const SelectedCol = (x) => {
    if (x.classList.contains("highlight")) {
        select_Col.delete(x.id);
    } else {
        select_Col.add(x.id);
    }
    x.classList.toggle("highlight");
    for (let i = 1; i < Rowsonload; i++) 
    {
        let col = document.getElementById(x.id + i);
        col.classList.toggle("highlight");
    }
}
// listener class to listen to events from every cell in the SpreadSheet
const listener = (td) => {
    // pipe to listen for every 300s
    // debounce time to emit only the last val
    rxjs.fromEvent(td,'input').pipe(rxjs.operators.debounceTime(300)).subscribe(x => {
        if (td.innerText.startsWith("=Sum(") && td.innerText.endsWith(")")) {
          //  let initalStr = td.innerText.substring(4, td.innerText.length);
            let actualStr = td.innerText.substring(5, td.innerText.length-1);
            let formula_cells_Arr = [];
            console.log(actualStr.split(":"));
            // splits with colon and gets the elements to be processed
            actualStr.split(":").forEach(x => {
                if (x.length > 1)
                    formula_cells_Arr.push(x);
            });
            if (formula_cells_Arr.length == 2)
             {
                // function to listen for sum formula
                sum(td,formula_cells_Arr);
            }
         } 
        else if (td.innerText.startsWith("=", 0) && td.innerText.length >= 6) 
        {
            let equation = td.innerText.substring(1, td.innerText.length);
            let operator;
            // block to identify the arith operator
            if (equation.includes("+"))
                operator = "+";
            else if (equation.includes("-"))
                operator = "-";
            else if (equation.includes("*"))
                operator = "*";
            else if (equation.includes("/"))
                operator = "/";
            let formula_cells_Arr = [];
            // split to get the elements to listen
            td.innerText.substring(1, td.innerText.length).split(operator).forEach(x => {
                if (x.length > 1) 
                {
                    formula_cells_Arr.push(x);
                }
        });
            // only if formula_cells_Arr length is 2
            if (formula_cells_Arr.length == 2) {
                if (operator === "+") {
                    td.setAttribute("isFormula", "true")
                    td.setAttribute("func", "sum")
                    operate(td, "+", formula_cells_Arr);
                } else if (operator === "-") {
                    td.setAttribute("isFormula", "true")
                    td.setAttribute("func", "diff")
                    operate(td, "-", formula_cells_Arr);
                } else if (operator === "*") {
                    td.setAttribute("isFormula", "true")
                    td.setAttribute("func", "mul")
                    operate(td, "*", formula_cells_Arr);
                } else if (operator === "/") {
                    td.setAttribute("isFormula", "true")
                    td.setAttribute("func", "div")
                    operate(td, "/", formula_cells_Arr);
                }
            }
            // block to listen for delete content backward
        } else if (x.inputType == "deleteContentBackward" && td.getAttribute("isFormula") == "true") {
            td.removeAttribute("isFormula");
            td.removeAttribute("func");
        }
        // emits the value based on input
        obs.next(x.target);
    });
}

const sum = (td, formula_cells_Arr) => {
    //checking if it is the same column
    if (formula_cells_Arr[0].charAt(0) == formula_cells_Arr[1].charAt(0))
     {
        let col = formula_cells_Arr[0].charAt(0);
        td.setAttribute("isFormula", "true")
            // gets the first and last of the cells
        let first = parseInt(formula_cells_Arr[0].substring(1, formula_cells_Arr[0].length));
        let last = parseInt(formula_cells_Arr[1].substring(1, formula_cells_Arr[1].length));

        // incase of adding a row between rows of formula range
        let Obs_Addrow = Addrowobs.subscribe(x => {
            if (x < last && x >= first) {
                last = parseInt(last) + 1;
            } else if (x < first) {
                first = parseInt(first) + 1;
                last = parseInt(last) + 1;
            }
        });
        //incase of deletion of the row 
        let Obs_Delrow = delRowObs.subscribe(x => {
            if (x <= last && x >= first)
            {
                last = parseInt(last - 1);
                console.log('last');
            } 
            else if (x < first) {
                first = parseInt(first) - 1;
                last = parseInt(last) - 1;
            }
            //when a row is deleted 
            for (let i = first; i <= last; i++)
             {
                let cell = document.getElementById(col + i);
                obs.next(cell);
             }
        });
        let sumobserver = obs.subscribe (x => {
            if (td.getAttribute("isFormula") && first != last) 
            {
                let sum = 0;
                // sum to listen to the cells and add
                for (let i = first; i <= last; i++) 
                {
                    sum = sum + parseInt(document.getElementById(col + i).innerText);
                }
                td.innerText = sum;
            }
             else 
             {
                //When the cell does not contain a formula then unsubscribe all the listeners 
                sumobserver.unsubscribe();   // unsubscribing the Sum listener   (sum of the values in same column)
                Obs_Addrow.unsubscribe();   // unsubscribing the addrow listener 
                Obs_Delrow.unsubscribe();    // unsubscribing the delrow listener 
             }
        });
    }
    else if (formula_cells_Arr[0].substring(1, formula_cells_Arr[0].length) == formula_cells_Arr[1].substring(1, formula_cells_Arr[1].length)) 
    {
        td.setAttribute("isFormula", "true");
        let observer = obs.subscribe(x => {
            // checks if its an formula cell
            if (td.getAttribute("isFormula"))
             {
                let sum = 0;
                let first = parseInt(formula_cells_Arr[0].charCodeAt(0));
                let last = parseInt(formula_cells_Arr[1].charCodeAt(0));
                let val = formula_cells_Arr[0].substring(1, formula_cells_Arr[0].length);
                for (let i = first; i <= last; i++)
                 {
                   sum = sum + parseInt(document.getElementById(String.fromCharCode(i) + val).innerText);
                 }
                td.innerText = sum;
            } 
            else
             { 
                 observer.unsubscribe();
             }
        });
    }
    else 
    {
        console.log("invalid");
    }
}
// operate function to listen to arith funct
const operate = (td, func, formula_cells_Arr) => {
    let a = document.getElementById(formula_cells_Arr[0]);
    let b = document.getElementById(formula_cells_Arr[1]);
    let val = true;
    let rowDelObserverOperate = delRowObs.subscribe(x => {
        // identifies if element is removed
        if (-1 == a.parentElement.rowIndex || -1 == b.parentElement.rowIndex) {
            val = false;
        }
    });
    let observer = obs.subscribe(x => {
        let sum = 0;
        if (val) {
            if (td.getAttribute("isFormula") && td.getAttribute("func") == "sum") {
                td.innerText = parseInt(a.innerText) + parseInt(b.innerText);
            } else if (td.getAttribute("isFormula") && td.getAttribute("func") == "diff") {
                td.innerText = parseInt(a.innerText) - parseInt(b.innerText);
            } else if (td.getAttribute("isFormula") && td.getAttribute("func") == "mul") {
                td.innerText = parseInt(a.innerText) * parseInt(b.innerText);
            } else if (td.getAttribute("isFormula") && td.getAttribute("func") == "div") {
                td.innerText = parseInt(a.innerText) / parseInt(b.innerText);
            } else {
                // unsubscribes if attr is not present
                td.removeAttribute("isFormula");
                td.removeAttribute("func");
                observer.unsubscribe();
            }
        } else {
            td.removeAttribute("isFormula");
            td.removeAttribute("func");
            observer.unsubscribe();
            rowDelObserverOperate.unsubscribe();
        }
    });
}


// event listener to listen to export button click
document.getElementById("export").addEventListener("click", function() {
    export_table_to_csv("table.csv");
});
// function to export the content to csv
function export_table_to_csv(filename)
 {
    let csv = [];
    let rows = document.querySelectorAll("table tr");
    for (let i = 0; i < rows.length; i++)
     {
        let row = [],
            cols = rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
        csv.push(row.join(","));
     }
    download_csv(csv.join("\n"), filename);
}
// method to download the csv
const download_csv = (csv, filename) => {
    let csvFile;
    let exportlink;
    csvFile = new Blob([csv], { func: "value/csv" });
    exportlink = document.createElement("a");
    exportlink.download = filename;
    exportlink.href = window.URL.createObjectURL(csvFile);
    exportlink.style.display = "none";
    document.body.appendChild(exportlink);
    exportlink.click();
}
// method to import the csv
document.getElementById("import").addEventListener('click', function() {
    let csvfile_upload = document.getElementById("csvUpload");
    csvfile_upload.click();
    csvfile_upload.onchange = function() 
    {
        console.log(csvfile_upload.value);
        let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test(csvfile_upload.value.toLowerCase())) {
            if (typeof(FileReader) != "undefined")
             {
                let reader = new FileReader();
                reader.onload = function(e)
                 {
                    let tabDel = document.getElementById("table");
                    tabDel.parentElement.removeChild(tabDel);
                    select_Col.clear();
                    Rowselected.clear();
                    let rows = e.target.result.split("\n");
                    Rowsonload = rows.length;
                    let max = 0;
                    for (let i = 0; i < rows.length; i++) 
                    {
                        let cells_Arr = rows[i].split(",");
                        if (cells_Arr.length > max) 
                        {
                            max = cells_Arr.length;
                        }
                    }
                    // gets the max col
                    Colsonload = max + 1;
                    let table = document.createElement("table");
                    table.setAttribute("id", "table");

                    for (let i = 0; i < Rowsonload; i++)
                     {
                        let row = table.insertRow(-1);
                        row.setAttribute("id", i);
                        for (let j = 0; j < Colsonload; j++)
                         {
                            let cell = row.insertCell(-1);
                            if (i != 0)
                                cell.setAttribute("id", String.fromCharCode(j + 64) + i);
                            else
                                cell.setAttribute("id", String.fromCharCode(j + 64));
                            if (i == 0 && j > 0) {
                                cell.innerHTML = String.fromCharCode(j + 64);
                                cell.addEventListener("click", function() {
                                    SelectedCol(cell);
                                }, false);

                                cell.setAttribute("id", String.fromCharCode(j + 64));
                            }
                             else if (j == 0 && i > 0) 
                            {
                                cell.innerHTML = i;
                                cell.addEventListener("click", function() 
                                {
                                 selectRow(row);
                                }, false);
                            } 
                            else if (j == 0 && i == 0) 
                            {
                                cell.setAttribute("contenteditable", "false");
                            } 
                            else 
                            {
                                let cells = rows[i - 1].split(",");
                                cell.innerHTML = cells[j - 1];
                                cell.setAttribute("contenteditable", "true");
                                listener(cell);
                            }
                        }
                    }

                    let SS = document.getElementById("SS");
                    SS.innerHTML = "";
                    SS.appendChild(table);
                    // appends the table
                }
                reader.readAsText(csvfile_upload.files[0]);
            }
        }
    };
})
