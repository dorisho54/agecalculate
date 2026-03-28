document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const birthDateInput = document.getElementById('birthDate');
    const resultArea = document.getElementById('resultArea');
    const actualAgeText = document.getElementById('actualAgeText');
    const humanAgeText = document.getElementById('humanAgeText');

    // 取得今天的日期字串 (格式為 YYYY-MM-DD)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 設定最大值為今天，避免選擇未來日期
    birthDateInput.setAttribute('max', todayStr);

    /**
     * 執行年齡計算並顯示結果的函數
     */
    const performCalculation = () => {
        const birthDateVal = birthDateInput.value;
        
        if (!birthDateVal) {
            return; 
        }

        // 將生日儲存到 localStorage
        localStorage.setItem('hermioneBirthDate', birthDateVal);

        const birth = new Date(birthDateVal);
        const now = new Date();

        if (birth > now) {
            return;
        }

        // --- 1. 計算實際年齡：歲、月、日 ---
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            // 借位：獲取上個月的天數
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += lastMonth.getDate();
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        actualAgeText.innerText = `${years} 歲 ${months} 月 ${days} 日`;

        // --- 2. 計算相當於人類年齡 ---
        // 換算總年份比例
        const totalYears = years + (months / 12) + (days / 365.25);
        let humanAgeResult;

        if (totalYears <= 0) {
            humanAgeResult = "剛出生 (幼兒期)";
        } else {
            // Math.log 為自然對數 ln
            const calculated = 16 * Math.log(totalYears) + 31;
            
            // 處理小於約 2 個月（結果小於 1 歲）的狀況
            if (calculated < 1) {
                humanAgeResult = "幼兒期 (約人類 1 歲以下)";
            } else {
                humanAgeResult = "約 " + calculated.toFixed(1) + " 歲";
            }
        }

        humanAgeText.innerText = humanAgeResult;
        
        // 顯示結果區塊
        resultArea.style.display = 'block';
    };

    // 【載入檢查】頁面載入時，從 localStorage 讀取已儲存的生日並自動計算
    const savedBirthDate = localStorage.getItem('hermioneBirthDate');
    if (savedBirthDate) {
        birthDateInput.value = savedBirthDate;
        performCalculation(); // 如果有舊資料，直接執行計算顯示結果
    }

    // 【按鈕監聽】點擊計算時執行
    calculateBtn.addEventListener('click', performCalculation);
});