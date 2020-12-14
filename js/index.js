const URL = "http://localhost:3000/tweets";

/**
 * Retrive Twitter Data from API
 */

 let nextPageUrl = null;

 const onEnter = (e) => {
     if(e.key == "Enter"){
        getTwitterData()
     }
 }

 const onNextPage = () => {
     if(nextPageUrl){
         getTwitterData()
     }
 }


const getTwitterData = () => {
    let query = document.getElementById("user-search-input").value;
    if(!query) return;
    const encodedQuery = encodeURIComponent(query); //for encoding #symbol
    let fullUrl = `${URL}?q=${encodedQuery}&count=10`;
    if(nextPageUrl){
        fullUrl = nextPageUrl;
    }
    fetch(fullUrl ,{
        method:'GET'
    }).then((response) => {
        return response.json();
    }).then((tweets) =>  {
        buildTweets(tweets.statuses);
        saveNextPage(tweets.search_metadata)
    })
}

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    if(metadata.next_results){
        nextPageUrl = `${URL}${metadata.next_results}`

    }else{
        nextPageUrl = null;
    }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    const text = e.innerHTML;
    console.log(text)
    document.getElementById("user-search-input").value = text;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    let twitterContent = "";
    tweets.map((tweet) => {
        const createdDate = moment(tweet.created_at).fromNow()
        twitterContent += `
        <div class="tweet-container">
                    <div class="tweet-user-info">
                        <div class="tweet-user-profile" style="background-image: url(${tweet.user.profile_image_url_https});">
                        </div>
                        <div class="tweet-user-name-container">
                            <div class="tweet-user-fullname">
                              ${tweet.user.name}
                            </div>
                            <div class="tweet-user-username">
                              ${tweet.user.screen_name}  
                            </div>
                        </div>
                    </div>
                    `
                    if (tweet.extended_entities &&
                        tweet.extended_entities.media.length > 0){
                        twitterContent+= buildImages(tweet.extended_entities.media);
                        twitterContent+= buildVideo(tweet.extended_entities.media);
                        }
                    
                    twitterContent += `
                    <div class="tweet-text-container">
                        ${tweet.full_text}
                    </div>

                    <div class="tweet-date-container">
                        ${createdDate}
                    </div>

                </div>
                `
    })
    document.querySelector('.tweets-list').innerHTML = twitterContent;
}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
    let imagesContent = `<div class="tweet-images-container">`;
    let imageExists = false
    mediaList.map((media)=>{
        if(media.type == "photo"){
            imageExists = true;
            imagesContent += `<div class="tweet-image" style="background-image: url(${media.media_url_https});"></div>`
        }
    })
    imagesContent += `</div>`
    return imageExists ? imagesContent : '';
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {
    let videoContent = `<div class="tweet-video-container">`;
    let imageExists = false;
    mediaList.map((media)=>{
        if(media.type == "video"){
            imageExists = true;
            videoContent += `
            <video controls>
                <source src="${media.video_info.variants[0].url}" type="video/mp4">      
            </video>
            `
        } else if(media.type == "animated_gif"){
            imageExists = true;
            videoContent += `
            <video loop autoplay>
                <source src="${media.video_info.variants[0].url}" type="video/mp4">      
            </video>
            `
        }
    })
    videoContent += `</div>`;
    return imageExists ? videoContent : '';
}

