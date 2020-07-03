//sets up pagination for book table




const resultList = document.querySelectorAll("tr.entry");

//set the number of students that will display per page
const itemsPerPage = 15;

//will be used to set the initial page number--will be page 1 to start
var pageNumber = 1;




const pageDiv = document.querySelector("div.page");




const noMatchMessageElement = document.createElement("H3");

noMatchMessageElement.innerText = "No matches found."

noMatchMessageElement.style.display = "none"; //will be turned on if there are no matches

pageDiv.appendChild(noMatchMessageElement);






const paginationDiv = document.createElement("DIV"); 

paginationDiv.classList.add("pagination");

pageDiv.appendChild(paginationDiv);






showPage(resultList, 1);


//append the page links
appendPageLinks(resultList);








function showPage(list, pageNumber)
{
   
   let startIndex = pageNumber * itemsPerPage - itemsPerPage;
   let endIndex = pageNumber * itemsPerPage;

//if the list of students passed is zero in length, then show the "No matches" message.
   if (list.length == 0)
   {
      noMatchMessageElement.style.display = "table-row";
   }
   else
   {
      noMatchMessageElement.style.display = "none";
   }

   

   for (i = 0; i < list.length; i++)
   {

      if (i >= startIndex && i < endIndex)
      {
         list[i].style.display = "table-row";
      }
      else
      {
         list[i].style.display = "none";
      }
      
   }
}





function appendPageLinks(list)
{

   //remove existing links, if there are any
   const exPaginationUl = document.querySelector(".pagination ul");

   if (exPaginationUl)
   {
      exPaginationUl.parentNode.removeChild(exPaginationUl);
   }


   //create new pagination ul

   var paginationUl = document.createElement("UL");

   paginationDiv.appendChild(paginationUl);

   var numberOfPages = Math.ceil(list.length / itemsPerPage);

   for(i = 0; i < numberOfPages; i++)
   {
      var liNode = document.createElement("LI");

      var aNode = document.createElement("A");

      aNode.href = '#';

      aNode.innerHTML = i+1;

      //set page 1 active to start
      if(i==0)
      {
         aNode.classList.add("active");
      }

      liNode.appendChild(aNode);

      paginationUl.appendChild(liNode);
   }

}





//event listener for pagination div (page number links)
paginationDiv.addEventListener("click", (event) => {

    var clickedNode = event.target;
 
    var pageAnchorNodes = document.querySelectorAll(".pagination a");
 
    for(i = 0; i < pageAnchorNodes.length; i++)
    {
       pageAnchorNodes[i].className = '';
    }
 
    //make the node that was clicked the active one
    clickedNode.className = "active";
 
    //get the page number to tell showPage what page to show
    var pageNumber = clickedNode.innerHTML;
 
    
    //const matchList = getMatchList();
 
    showPage(resultList, pageNumber);
 
 });





