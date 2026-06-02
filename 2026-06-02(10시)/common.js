// common.js
const SUPABASE_URL = 'https://xkxqbowangecvotyxwsz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreHFib3dhbmdlY3ZvdHl4d3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTEwNDEsImV4cCI6MjA5NDMyNzA0MX0.LvNmU2zzN70VnHvIIxv0hGZxvjUE2HlLKc5H-inSQLM';

// 다른 파일에서 db라는 변수명으로 바로 접근할 수 있도록 전역(window) 객체에 등록합니다.
// settings.html에서 사용하던 세션 비활성화 옵션을 공통 적용해도 다른 페이지에 문제가 없습니다.
window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

// 3. AI 분석 요청 공통 함수
async function submitToAI(currentGrade) {
    // 공통 데이터 수집 (ID값들을 동일하게 맞춘다고 가정)
    const classNum = document.getElementById('classNum').value;
    const studentNum = document.getElementById('studentNum').value;
    const studentName = document.getElementById('studentName').value;
    const major = document.getElementById('major').value;

    if (!classNum || !studentNum || !studentName || !major) {
        alert("필수 항목을 모두 입력해주세요!");
        return;
    }

    // 화면 준비
    const responseArea = document.getElementById('aiResponseArea');
    const resultText = document.getElementById('aiResultText');
    responseArea.style.display = 'block';
    resultText.innerHTML = "<strong>⏳ AI 진로 상담 교사가 분석 중입니다...</strong>";

    // 학년별로 다른 프롬프트 구성 (폼 데이터 수집 로직은 각 파일에 맞춰 조정 가능)
    const promptText = generatePrompt(currentGrade);

    const apiKey = '여기에_발급받은_API_키를_넣으세요';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        resultText.innerHTML = aiText.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("오류 발생:", error);
        resultText.innerHTML = "<span style='color:red;'>분석 중 오류가 발생했습니다.</span>";
    }
}