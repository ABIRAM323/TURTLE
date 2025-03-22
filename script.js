const pdfInput = document.getElementById('pdfInput');
const uploadBtn = document.getElementById('uploadBtn');
const previewArea = document.getElementById('previewArea');
const downloadBtn = document.getElementById('downloadBtn');

let dataset = null;
const API_URL = "http://127.0.0.1:5000"; // Replace with actual ngrok URL

uploadBtn.addEventListener('click', async () => {
    const file = pdfInput.files[0];
    if (!file || file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.error) {
            alert(result.error);
            return;
        }

        dataset = result.dataset;
        previewArea.innerHTML = dataset.map(item => `<p><b>Q:</b> ${item.question}<br><b>A:</b> ${item.answer}</p>`).join('');
    } catch (error) {
        alert('Error uploading file. Check the API connection.');
    }
});

// Handle Download
downloadBtn.addEventListener('click', () => {
    if (!dataset) {
        alert('No data to download. Upload a PDF first.');
        return;
    }

    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dataset.json';
    link.click();
});
