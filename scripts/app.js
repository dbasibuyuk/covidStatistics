function drawChart (dataPoints) 
{
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            
        },
        data: [{        
            type: "line",
              indexLabelFontSize: 16,
              lineColor: "red",
              markerColor: "#000000",
            dataPoints: dataPoints
        }]
    });

    chart.render();
}



async function fetchData(country, buttonNo)
{
    // Get data 
    let date = new Date();
    date.setDate(date.getDate() - 15);

    let url = 'https://api.covid19api.com/live/country/' + country + '/status/confirmed/date/' + date.toISOString();

    let data = await fetch(url,{method : 'GET'})
    .then(res => res.json())
    .catch(error => console.log('Error!'));




    if(buttonNo == 0)
    {

        let temp = [];
        let cases = [];



        // total deaths last 15 days 
        for(let day of data)
        {
            temp.push(day.Deaths);
        }
        
        // daily death numbers
        for(let i = 0; i < temp.length - 1; i++)
        {
            cases.push({x: i + 1, y : (temp[i + 1] - temp[i])});
        }

        drawChart(cases);
    }

    else if(buttonNo == 1)
    {
        let confirmed = [];
        let i = 1;
        for(let day of data)
        {
            confirmed.push({x: i, y : day.Confirmed});
            i++;
        }

        drawChart(confirmed);
    }

    else if(buttonNo == 2)
    {
        let active = [];

        let i = 1;

        for(let day of data)
        {
            active.push({x: i, y : day.Active});
            i++;
        }

        drawChart(active);

    }
}

function buttonDesactivate()
{
    const buttons = document.querySelectorAll('.list-group button');
    for(let button of buttons)
    {
        button.classList.remove('active');
    }    
}


const buttons = document.querySelectorAll('.list-group button');
const groupButtons = document.querySelectorAll('.btn-group button');


for(let button of buttons)
{
    button.addEventListener('click', async (event) =>
    {
        groupButtons[0].classList.add('active');
        buttonDesactivate();
        button.classList.add('active');
        await fetchData(button.innerText.replace( /\s/g, '').toLowerCase(), 0);
    })
}


//  death numbers
groupButtons[0].addEventListener('click', async (event) =>
{
    if(document.querySelector('.list-group button.active'))
    {
        await fetchData(document.querySelector('.list-group button.active').innerText.replace( /\s/g, '').toLowerCase(), 0);
    }
})

// confirmed cases
groupButtons[1].addEventListener('click', async (event) =>
{
    if(document.querySelector('.list-group button.active'))
    {
        groupButtons[0].classList.remove("active");
        await fetchData(document.querySelector('.list-group button.active').innerText.replace( /\s/g, '').toLowerCase(), 1);
    }
})

// activate cases
groupButtons[2].addEventListener('click', async (event) =>
{
    if(document.querySelector('.list-group button.active'))
    {
        groupButtons[0].classList.remove("active");
        await fetchData(document.querySelector('.list-group button.active').innerText.replace( /\s/g, '').toLowerCase(), 2);
    }
})


window.onload = () =>
{
    // page load

    let onloads = [];

    for(let i = 0; i < 14; i++)
    {
        onloads.push({x : i + 1, y : i + 1});
    }

    drawChart(onloads);
}





