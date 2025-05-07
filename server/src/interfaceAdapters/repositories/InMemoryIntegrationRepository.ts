// import { Integration } from "../../entities/Integration";
// import { IntegrationRepository } from "./IntegrationRepository";

// class InMemoryIntegrationRepository implements IntegrationRepository {
//     private integrations: Map<string, Integration> = new Map();

//     public async saveIntegration(roomId: string, data: Integration): Promise<void> {
//         this.integrations.set(roomId, data);
//     }

//     public async findIntegrationById(roomId: string): Promise<Integration | undefined> {
//         return this.integrations.get(roomId);
//     }

//     public async deleteIntegration(roomId: string): Promise<void> {
//         if (!this.integrations.get(roomId)) {
//             throw new Error("The integration doesn't exists!");
//         }
//         this.integrations.delete(roomId);
//     }
// }

// export default InMemoryIntegrationRepository;
