(function () {
	console.log(11);
    if (navigator.serviceWorker) {

        var msgIpt = document.getElementById('ipt'),
            showArea = document.getElementById('show'),
            sendBtn = document.getElementById('sendBtn');


        navigator.serviceWorker.register('service-worker.js');


        navigator.serviceWorker.addEventListener('message', function (event) {
            showArea.innerHTML = showArea.innerHTML + ('<li>' + event.data.message + '</li>');
        });

        sendBtn.addEventListener('click', function () {

            // 鍙戦€佹暟鎹�
            navigator.serviceWorker.controller.postMessage(msgIpt.value);
            msgIpt.value = '';
        });
    }
})();