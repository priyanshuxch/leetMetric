document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.querySelector('.search-btn');
  const usernameInput = document.querySelector('.user-input');
  const statsContainer = document.querySelector('.stats-container');
  const easyProgressCircle = document.querySelector('.easy-progress');
  const mediumProgressCircle = document.querySelector('.medium-progress');
  const hardProgressCircle = document.querySelector('.hard-progress');
  const easyLabel = document.querySelector('.easy-label');
  const mediumLabel = document.querySelector('.medium-label');
  const hardLabel = document.querySelector('.hard-label');
  const cardStatsContainer = document.querySelector('.stats-card');

  //return true or false based on a regex
  function validateUsername(username) {
    if(username.trim() === '') {
      alert('Username should not be empty');
      return false;
    }
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    const isMatching = regex.test(username);
    if(!isMatching) {
      alert('Invalid username'); 
    } 
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = 'Searching...';
      searchButton.disabled = true;

      const response = await fetch(url);
      if(!response.ok) {
        throw new Error('Unable to fetch the User details');
      }

      const data = await response.json();
      displayUserData(data);

    } catch(err) {
      statsContainer.innerHTML = '<p>No data found</p>';
      console.log(err);

    } finally {
      searchButton.textContent = 'Search';
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved/total)*100;
    circle.style.setProperty('--progress-degree', `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    const solvedTotalQues = parsedData.totalSolved;
    const solvedTotalEasyQues = parsedData.easySolved;
    const solvedTotalMediumQues = parsedData.mediumSolved;
    const solvedTotalHardQues = parsedData.hardSolved;

    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

    const cardData = [
      {label:'Ranking', value:parsedData.ranking},
      {label:'Acceptance Rate', value:parsedData.acceptanceRate},
      {label:'Contribution Points', value:parsedData.contributionPoints},
      {label:'Average Submissions', value:parsedData.submissionCalendar['1730505600']}
    ];

    cardStatsContainer.innerHTML = cardData.map(
      data =>
        `<div class='card'>
            <h3 class='card-title'>${data.label}</h3>
            <p>${data.value}</p>
          </div>`
    ).join('')
  }

  searchButton.addEventListener('click', function() {
    const username = usernameInput.value;
    if(validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});