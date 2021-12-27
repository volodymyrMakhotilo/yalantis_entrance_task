package main

import (
	"encoding/json"
	"net/http"
)

var Members []Member

type Member struct {
	Name string `json:"name"`
	Email string `json:"email"`
	RegistrationDate string `json:"registration_date"`
}

func middleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(w, r)
	}
}

var getMember = func(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Members[len(Members)-1])
}

var addMember =  func(w http.ResponseWriter, r *http.Request) {
	member := Member{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	for _,element := range Members{
		if element.Email == member.Email {
			http.Error(w, "Email should be unique", http.StatusConflict)
			return
		}
	}
	Members = append(Members, member)
	getMember(w,r)
}

var getMembers = func(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Members)
}

func Handlers(){
	http.HandleFunc("/member",middleware(addMember))
	http.HandleFunc("/members",middleware(getMembers))
}

func main(){
	 Handlers()
	 http.ListenAndServe(":8080", nil)
  }
