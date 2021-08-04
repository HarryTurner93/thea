
# System Import
import pathlib

# Third Party
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torchvision.transforms import transforms


class Model(nn.Module):
    def __init__(self) -> None:
        """Initialise Model."""
        super().__init__()

        backbone = models.resnet50()
        layers = list(backbone.children())[:-1]
        self.feature_extractor = nn.Sequential(*layers)

        _fc_layers = [
            nn.Linear(2048, 256),
            nn.ReLU(),
            nn.Linear(256, 32),
            nn.Linear(32, 4),
        ]
        self.fc = nn.Sequential(*_fc_layers)

        # Check model file exists.
        if not pathlib.Path("/model/model.pth").exists():
            raise Exception("Model file has not been downloaded. Please see README.")

        # Load model.
        state_dict = torch.load("/model/model.pth", map_location="cpu")
        self.load_state_dict(state_dict, strict=False)

    def forward(self, x):
        x = self.feature_extractor(x)
        x = x.squeeze(-1).squeeze(-1)
        x = self.fc(x)

        return F.log_softmax(x, dim=1)


# Model
model = Model()


# Input Transform
input_transform = transforms.Compose([
    transforms.Resize((224, 224), interpolation=Image.NEAREST),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225])
])


# Output Transform
def output_transform(preds):
    return np.around(np.exp(preds.squeeze().cpu().detach().numpy()), 2)
