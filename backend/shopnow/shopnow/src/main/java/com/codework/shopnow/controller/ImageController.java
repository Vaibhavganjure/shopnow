package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.ImageDto;
import com.codework.shopnow.model.Image;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.image.IImageService;
import com.codework.shopnow.service.image.ImageService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;


@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/images")
public class ImageController {

    private final IImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadImages(@RequestParam("files") List<MultipartFile> files, @RequestParam("productId") Long productId) {
            List<ImageDto> imageDto = imageService.saveImages(productId, files);
            return ResponseEntity.ok(new ApiResponse("Image uploaded successfully", imageDto));

    }

    @GetMapping("/image/download/{imageId}")
    public ResponseEntity<ByteArrayResource> downloadImage(@PathVariable Long imageId) throws SQLException {
        Image image = imageService.getImageById(imageId);

        ByteArrayResource resource = new ByteArrayResource(image.getImage().getBytes(1, (int) image.getImage().length()));

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getFileType())).header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\" + image.getFileName() + \"")
                .body(resource);
    }

    @PutMapping("/image/{imageId}/update")
    public ResponseEntity<ApiResponse> updateImages(@RequestBody MultipartFile file, @PathVariable Long imageId) {
            imageService.updateImage(file, imageId);
            return ResponseEntity.ok(new ApiResponse("Success", "Image updated successfully"));
    }

    @DeleteMapping("/delete/{imageId}")
    public ResponseEntity<ApiResponse> deleteImages(@PathVariable Long imageId) {
            imageService.deleteImageById(imageId);
            return ResponseEntity.ok(new ApiResponse("Success", "Image deleted successfully"));


    }
}