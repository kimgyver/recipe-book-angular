import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put(
        'https://ng-recipe-book-jason-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => console.log('put', response));
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng-recipe-book-jason-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipe) =>
          recipe.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          })
        ),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
          console.log('get', recipes);
        })
      );
    // .subscribe((recipes) => {
    //   this.recipeService.setRecipes(recipes);
    //   console.log('get', recipes);
    // });
  }
}
