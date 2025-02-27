import { Integration } from "../../entities/Integration";
import { IntegrationRepository } from "./IntegrationRepository";

class InMemoryIntegrationRepository implements IntegrationRepository {
    private integrations: Map<string, Integration> = new Map();

    public async saveIntegration(data: Integration): Promise<void> {
        const { id } = data;
        this.integrations.set(id, data);
    }

    public async findIntegrationById(id: string): Promise<Integration | undefined> {
        return this.integrations.get(id);
    }

    public async deleteIntegration(id: string): Promise<void> {
        if (!this.integrations.get(id)) {
            throw new Error("The integration doesn't exists!");
        }
        this.integrations.delete(id);
    }

    public async getAllIntegrations(): Promise<Integration[]> {
        return Object.values(this.integrations);
    }
}

export default InMemoryIntegrationRepository;