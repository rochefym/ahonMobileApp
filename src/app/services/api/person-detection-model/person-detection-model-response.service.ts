import { Injectable } from '@angular/core';
import { PersonDetectionModelApiService } from './person-detection-model-api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonDetectionModelResponseService {

  constructor(
    private personDetectionModelApi: PersonDetectionModelApiService
  ) { }

  async updatePersonDetectionModel(personDetectionModel: any): Promise<any> {
    try {
      const response = await this.personDetectionModelApi.updatePersonDetectionModelApi(personDetectionModel).toPromise();
      const modelResponse = response;
      return modelResponse;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }

  async getSelectedModel(): Promise<any> {
    try {
      const response = await this.personDetectionModelApi.getAllPersonDetectionModels().toPromise();
      let selectedModel = null;

      // Process the models array
      response.forEach((model: any) => {
        if (model.is_selected) { selectedModel = model; }
      });

      return selectedModel;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }
}
