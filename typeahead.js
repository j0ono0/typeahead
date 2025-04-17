
class Typeahead {
    constructor(delay, component, tmdb_token) {
        this.timer;
        this.delay = delay;
        this.tmdb_token = tmdb_token;
        this.component = component;
        this.input_title = this.component.querySelector(".movie_title")
        this.input_year = this.component.querySelector(".movie_year")
        this.input_director = this.component.querySelector(".movie_director")
        // Listen for changes to title input
        this.input_title.addEventListener('input', this.inputListener.bind(this));
    }

    inputListener(evt) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.create_suggestion_list.bind(this), this.delay);
    }

    create_suggestion_list(){
        this.tmdb_film_search(this.input_title.value, this.tmdb_token)
        .then(json=> {
            this.clear_title_suggestion_list();
            if(json.total_results > 0){
                const elem = this.build_movie_suggestion_list(json);
                this.component.append(elem);
            }
        })
    }
    
    tmdb_film_search(title_search_text, tmdb_token) {
        const search_url = `https://api.themoviedb.org/3/search/movie?query=${title_search_text}&include_adult=false&language=en-US&page=1`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdb_token}`
            }
        };
        return fetch(search_url, options)
        .then(res => res.json())
        .catch(err => console.error(err));
    }
    
    clear_title_suggestion_list(){
        // Remove any existing title_suggestion_lists
        document.querySelectorAll("#title_suggestion_list").forEach(elem=>elem.remove());
    }
    
    build_movie_suggestion_list(json){
        let ul = document.createElement("ul");
        ul.id = "title_suggestion_list"
        json.results.forEach(movie_details=>{
            let li = document.createElement("li");
            let anchor = document.createElement("a");
            ul.appendChild(li)
            li.appendChild(anchor)
            anchor.href = `#${movie_details.id}`;
            anchor.innerHTML = `${movie_details.title} (${movie_details.release_date.split("-")[0]})`
            
            anchor.addEventListener('click', this.populate_input_with_tmdb_data.bind(this, movie_details))
        })
        return ul
    }
    
    populate_input_with_tmdb_data(movie_details) {
        this.clear_title_suggestion_list();
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.tmdb_token}`
            }
        };
        const credits_url = `https://api.themoviedb.org/3/movie/${movie_details.id}/credits?language=en-US`;
        fetch(credits_url, options)
        .then(res => res.json())
        .then(res => {
            let directors = res.crew.filter(person => person.job == "Director")
            this.input_title.value = movie_details.title;
            this.input_year.value = movie_details.release_date.split("-")[0];
            this.input_director.value = directors[0].name;
        })
        .catch(err => console.error(err));
    }
    
}
