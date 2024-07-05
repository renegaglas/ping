package fr.epita.assistants.myide.utils;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequest {
    public String path;
    public int from;
    public int to;
    public String content;
}