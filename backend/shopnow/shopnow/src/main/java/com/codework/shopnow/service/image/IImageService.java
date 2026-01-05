package com.codework.shopnow.service.image;

import com.codework.shopnow.dtos.ImageDto;
import com.codework.shopnow.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(Long imageId);
    void deleteImageById(Long imageId);


    void updateImage(MultipartFile file, Long imageId);

    List<ImageDto> saveImages(Long productId, List<MultipartFile> files);
}
