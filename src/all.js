let select = document.querySelector('.select');
let hotDistrict = document.querySelector('.button-list');
let title = document.querySelector('.title');
let cardList = document.querySelector('.card-list');
let pageArea = document.querySelector('.pagination');

//result = axios.get("url....") -> result.status
//請求資料來源
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function() {
    if (xhr.status !== 200) {
        return;
    }
    //轉換 JSON 格式的資料
    let data = JSON.parse(xhr.responseText).result.records;
    console.log(data);

    //取得行政區的列表
    //item 為 data 裡每個景點資料，也就是正在處理 array 裡的 object，此步驟為將 districtData 改為只有 Zone 的陣列
    let districtData = data.map(function(element, index, array) {
        return element.Zone;
    });
    //array 為原本 districtData 的陣列
    //此步驟為將 districtData 陣列中，元素第一次出現的 index，是否為此元素現在的 index 作為判斷
    let districtOption = districtData.filter(function(element, index, array) {
        return array.indexOf(element) === index;
    })
    optionList();
    showTitle();
    showList(data);
    pagination(data, 1);

    function optionList() {
        let str = '';
        str = `<option value="全部行政區" >全部行政區</option>`;
        for (let i = 0; i < districtOption.length; i++) {
            str += `<option class="option" value="${districtOption[i]}" >${districtOption[i]}</option>`
        }
        select.innerHTML = str;
    }

    select.addEventListener('change', showTitle, false);
    // select.addEventListener('change', showList, false);
    pageArea.addEventListener('click', switchBtn, false);

    function showTitle() {
        let option = select.value;
        title.textContent = option;

        let selectedData = data.filter(item => select.value == item.Zone || select.value == '全部行政區')

        pagination(selectedData, 1);
    }


    // 制作分頁功能
    function pagination(data, nowPage) {
        // 取得資料長度
        let dataTotal = data.length; // 所有資料的長度
        let perPageData = 4; // 每頁顯示的資料個數
        let pageNum = Math.ceil(dataTotal / perPageData); // 總共有幾個分頁按鈕，無條件進位
        console.log(`全部資料:${dataTotal} 每一頁顯示:${perPageData}筆`);
        let currentPage = nowPage; // 現在的頁數
        // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
        if (currentPage > pageNum) {
            currentPage = pageNum
        }
        console.log(currentPage);
        // 每頁的第一筆資料及最後一筆資料編號
        const firstData = (currentPage * perPageData) - perPageData + 1;
        const lastData = currentPage * perPageData;
        // 建立一個新的陣列
        const dataList = [];
        // 處理 data 的資料
        data.forEach((item, index) => {
            // 設定陣列中的資料編號
            const num = index + 1;
            if (num >= firstData && num <= lastData)
                dataList.push(item); // 將分頁中的資料帶進新的陣列中
        });
        console.log(dataList);

        const page = {
            pageNum,
            currentPage,
            // hasPre: currentPage > 1,
            // hasNext: currentPage < pageNum,
        }
        pageBtn(page);
        showList(dataList);
    }
    // 顯示畫面
    function showList(dataList) {
        let str = '';
        dataList.forEach((item) => {
            str += `<h1>${item.Name}</h1>`;
        })
        cardList.innerHTML = str
    }
    // 顯示按鈕
    function pageBtn(page) {
        let pageStr = ''
        for (let i = 0; i < page.pageNum; i++) {
            pageStr += `<button class="cursor-pointer py-1 px-3 hover:rounded-full hover:border hover:bg-violet-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-index="${i + 1}">${i + 1}</button>`;
        }
        console.log(pageStr);
        pageArea.innerHTML = pageStr;
    }
    // 切換頁數
    function switchBtn(e) {
        let selectedData = data.filter(item => select.value == item.Zone || select.value == '全部行政區')
            // let selectedData = [];
            // for (var i = 0; i < data.length; i++) {
            //     if (select.value == data[i].Zone || select.value == '全部行政區') {
            //         selectedData.push(data[i]);
            //     }
            // }
        e.preventDefault();
        if (e.target.tagName !== 'BUTTON') { return };
        const page = e.target.dataset.index;
        pagination(selectedData, page);
        console.log(page);
    }

}