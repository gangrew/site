document.addEventListener('DOMContentLoaded', function () {
    const addLaneBtn = document.getElementById('add-lane-btn');
    const lanesContainer = document.getElementById('lanes');
    const laneModal = document.getElementById('lane-modal');
    const closeLaneModal = document.getElementById('close-lane-modal');
    const laneForm = document.getElementById('lane-form');
    const laneTitleInput = document.getElementById('lane-title');
    const laneIdInput = document.getElementById('lane-id');
    const deleteLaneBtn = document.getElementById('delete-lane-btn');
    let currentLane = null;

    addLaneBtn.addEventListener('click', function () {
        currentLane = null;
        laneIdInput.value = '';
        laneTitleInput.value = '';
        laneModal.style.display = 'block';
    });

    closeLaneModal.addEventListener('click', function () {
        laneModal.style.display = 'none';
    });

    laneForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const laneTitle = laneTitleInput.value.trim();
        if (laneTitle) {
            if (currentLane) {
                const laneHeading = currentLane.querySelector('.heading');
                laneHeading.textContent = laneTitle;
            } else {
                const lane = document.createElement('div');
                lane.className = 'swim-lane';
                lane.innerHTML = `
                    <div class="heading">${laneTitle}</div>
                    <button class="add-task-btn">Add Task +</button>
                    <div class="cards"></div>
                `;

                lane.querySelector('.heading').addEventListener('click', function () {
                    currentLane = lane;
                    laneIdInput.value = lane.dataset.id;
                    laneTitleInput.value = laneTitle;
                    laneModal.style.display = 'block';
                });

                lane.querySelector('.add-task-btn').addEventListener('click', function () {
                    openTaskModal(lane);
                });

                lanesContainer.appendChild(lane);
            }
            laneModal.style.display = 'none';
        }
    });

    deleteLaneBtn.addEventListener('click', function () {
        if (currentLane) {
            lanesContainer.removeChild(currentLane);
            currentLane = null;
            laneModal.style.display = 'none';
        }
    });

    window.onclick = function (event) {
        if (event.target === laneModal) {
            laneModal.style.display = 'none';
        }
    };
});
